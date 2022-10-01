import { useEffect, useCallback, useSyncExternalStore } from "react";
import globalProvider from "./Provider/DefaultGlobalProvider";
import { useFetchContext } from "./Provider/useFetchContext";

import resolveIfNotUndefined from "./utils/resolveIfNotUndefined";

interface useFetchOptions {
	revalidateOnMount?: boolean;
	revalidateOnFocus?: boolean;
	fallbackData?: any;
	fetcher?: (key: string) => Promise<any>;
	dedupingInterval?: number;
}

const useFetch = (key: string, options: useFetchOptions = {}) => {
	const wrappedContext = useFetchContext();

	const fallbackData = resolveIfNotUndefined(
		options.fallbackData,
		wrappedContext?.fallback?.[key],
		undefined
	);
	const fetcher = resolveIfNotUndefined(
		options.fetcher,
		wrappedContext?.fetcher,
		globalProvider.fetcher
	);

	const revalidateOnMount = resolveIfNotUndefined(
		options.revalidateOnMount,
		wrappedContext?.revalidateOnMount,
		globalProvider.revalidateOnMount
	);
	const revalidateOnFocus = resolveIfNotUndefined(
		options.revalidateOnFocus,
		wrappedContext?.revalidateOnFocus,
		globalProvider.revalidateOnFocus
	);
	const dedupingInterval = resolveIfNotUndefined(
		options.dedupingInterval,
		wrappedContext?.dedupingInterval,
		globalProvider.dedupingInterval,
		2000
	);

	const {
		setEntry,
		entries: overallDataCache,
		subscribe: subscribeToCache,
	} = wrappedContext?.cache || globalProvider.cache;
	const {
		entries: fetchingFor,
		setFetching,
		subscribe: subscribeToFetching,
	} = wrappedContext?.fetching || globalProvider.fetching;
	const {
		errors,
		setError,
		subscribe: subscribeToErrors,
	} = wrappedContext?.errors || globalProvider.errors;
	const lastFetched = wrappedContext?.lastFetched || globalProvider.lastFetched;

	// Sync hook with cache for the data.
	const data = useSyncExternalStore(subscribeToCache, () =>
		overallDataCache.get(key)
	);
	// Sync hook for validating and error updates as well
	useSyncExternalStore(subscribeToFetching, () => fetchingFor.get(key));
	useSyncExternalStore(subscribeToErrors, () => errors.get(key));

	const setLastFetched = () => lastFetched.set(key, new Date().getTime());

	const allowedToFetchData = (isFromRevalidate = false) => {
		const isCurrentlyFetching = fetchingFor.get(key);
		if (isCurrentlyFetching) {
			// Already being fethed somewhere else.
			// That hook will make the request, get the data and populate the global cache.
			// Which will reflect here.
			return false;
		}

		// Check for deduping interval.
		if (isFromRevalidate) {
			// If the invocation is from revalidate, always let it go through.
			const lastFetchedForKey = lastFetched.get(key);
			const now = new Date().getTime();
			if (lastFetchedForKey && now - lastFetchedForKey < dedupingInterval)
				return false;
		}
		return true;
	};

	const fetchData = async (isFromRevalidate = false) => {
		if (!allowedToFetchData(isFromRevalidate)) return;
		setFetching(key, true);
		fetcher(key)
			.then((dataFetched: any) => {
				setEntry(key, dataFetched);
				setFetching(key, false);
				setError(key, undefined);
				setLastFetched();
			})
			.catch((err: Error) => {
				setEntry(key, undefined);
				setError(key, err);
				setFetching(key, false);
			});
	};

	useEffect(() => {
		if (revalidateOnMount) fetchData();
	}, [revalidateOnMount]);

	const revalidate = useCallback(
		async (
			updater?: () => Promise<any> | any,
			revalidateAfterSetting?: boolean
		) => {
			if (typeof updater === "function") {
				const updatedData = await updater();
				setEntry(key, updatedData);
				if (revalidateAfterSetting) fetchData(true);
				return updatedData;
			} else if (typeof updater !== "undefined") {
				setEntry(key, updater);
				if (revalidateAfterSetting) fetchData(true);
			} else fetchData(true);
		},
		[fetchData, key]
	);

	return {
		data:
			typeof data === "undefined" && typeof fallbackData !== "undefined"
				? fallbackData
				: data,
		revalidate,
		isValidating: fetchingFor.get(key) || false,
		error: errors.get(key) || undefined,
	};
};

export default useFetch;
