import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import globalProvider from "./Provider/DefaultGlobalProvider";
import { useFetchContext } from "./Provider/useFetchContext";

interface useFetchOptions {
	revalidateOnMount?: boolean;
	revalidateOnFocus?: boolean;
	fallbackData?: any;
	fetcher?: (key: string) => Promise<any>;
}

const useFetch = (key: string, options: useFetchOptions) => {
	const wrappedContext = useFetchContext();

	const fallbackData =
		options.fallbackData || wrappedContext?.fallback?.[key] || undefined;
	const fetcher =
		options.fetcher || wrappedContext?.fetcher || globalProvider.fetcher;
	const revalidateOnMount =
		options.revalidateOnMount ||
		wrappedContext?.revalidateOnMount ||
		globalProvider.revalidateOnMount;
	const revalidateOnFocus =
		options.revalidateOnFocus ||
		wrappedContext?.revalidateOnFocus ||
		globalProvider.revalidateOnFocus;

	const {
		setEntry,
		entries: overallDataCache,
		subscribe,
	} = wrappedContext?.cache || globalProvider?.cache;
	const {
		entries: fetchingFor,
		setFetching,
		subscribe: subscribeToFetching,
	} = wrappedContext?.fetching || globalProvider?.fetching;

	const data = useSyncExternalStore(subscribe, () => overallDataCache.get(key));
	const isValidating = useSyncExternalStore(subscribeToFetching, () =>
		fetchingFor.get(key)
	);
	const [error, setError] = useState(undefined);

	const fetchData = useCallback(async () => {
		if (isValidating) {
			// Already being fethed somewhere else.
			// That hook will make the request, get the data and populate the global cache.
			// Which will reflect here.
			return;
		}
		setFetching(key, true);
		fetcher(key)
			.then((dataFetched) => {
				setEntry(key, dataFetched);
				setFetching(key, false);
				setError(undefined);
			})
			.catch((err) => {
				setEntry(key, undefined);
				setError(err);
				setFetching(key, false);
			});
	}, [key, isValidating]);

	useEffect(() => {
		if (revalidateOnMount) fetchData();
	}, []);

	const revalidate = useCallback(
		async (
			updater?: () => Promise<any> | any,
			revalidateAfterSetting?: boolean
		) => {
			if (typeof updater === "function") {
				const updatedData = await updater();
				setEntry(key, updatedData);
				if (revalidateAfterSetting) fetchData();
				return updatedData;
			} else if (typeof updater !== "undefined") {
				setEntry(key, updater);
				if (revalidateAfterSetting) fetchData();
			} else fetchData();
		},
		[fetchData]
	);

	return { data: data || fallbackData, revalidate, isValidating, error };
};

export default useFetch;
