import { useEffect, useCallback, useSyncExternalStore } from "react";
import globalProvider from "./Provider/DefaultGlobalProvider";
import { useFetchContext } from "./Provider/useFetchContext";

import type FetchKey from "./singleTypes/Fetchkey";
import type Revalidator from "./singleTypes/Revalidator";

import resolveIfNotUndefined from "./utils/resolveIfNotUndefined";

interface useFetchOptions {
	revalidateOnMount?: boolean;
	revalidateOnFocus?: boolean;
	fallbackData?: any;
	fetcher?: (key: string) => Promise<any>;
	dedupingInterval?: number;
}

const useFetch = (key: FetchKey, options: useFetchOptions = {}) => {
	const wrappedContext = useFetchContext();

	const contextToReferTo = wrappedContext || globalProvider;

	const isKeyFetchable = key !== null;

	const fallbackData = resolveIfNotUndefined(
		options.fallbackData,
		isKeyFetchable ? contextToReferTo.fallback?.[key] : undefined,
		undefined
	);
	const fetcher = resolveIfNotUndefined(
		options.fetcher,
		contextToReferTo.fetcher
	);

	const revalidateOnMount = resolveIfNotUndefined(
		options.revalidateOnMount,
		contextToReferTo.revalidateOnMount
	);
	const revalidateOnFocus = resolveIfNotUndefined(
		options.revalidateOnFocus,
		contextToReferTo.revalidateOnFocus
	);
	const dedupingInterval = resolveIfNotUndefined(
		options.dedupingInterval,
		contextToReferTo.dedupingInterval,
		2000
	);

	const {
		setEntry,
		entries: overallDataCache,
		subscribe: subscribeToCache,
	} = contextToReferTo.cache;
	const {
		entries: fetchingFor,
		setFetching,
		subscribe: subscribeToFetching,
	} = contextToReferTo.fetching;
	const {
		errors,
		setError,
		subscribe: subscribeToErrors,
	} = contextToReferTo.errors;
	const { lastFetched } = contextToReferTo;

	// Sync hook with cache for the data.
	const data = useSyncExternalStore(
		subscribeToCache,
		isKeyFetchable ? () => overallDataCache.get(key) : () => null
	);
	// Sync hook for validating and error updates as well
	useSyncExternalStore(subscribeToFetching, () =>
		isKeyFetchable ? fetchingFor.get(key) : () => null
	);
	useSyncExternalStore(subscribeToErrors, () =>
		isKeyFetchable ? errors.get(key) : () => null
	);

	const setLastFetched = () => {
		if (isKeyFetchable) lastFetched.set(key, new Date().getTime());
	};

	const allowedToFetchData = (isFromRevalidate = false) => {
		if (!isKeyFetchable) return false;

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
		if (!allowedToFetchData(isFromRevalidate) || !isKeyFetchable) return;
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

	const revalidate: Revalidator = useCallback(
		async (
			updater?: () => Promise<any> | any,
			revalidateAfterSetting?: boolean
		) => {
			if (!isKeyFetchable) return;

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

	useEffect(() => {
		if (!isKeyFetchable) return;
		contextToReferTo.revalidators.set(key, revalidate);
		return () => {
			contextToReferTo.revalidators.set(key, undefined);
		};
	}, [revalidate]);

	return {
		data:
			typeof data === "undefined" && typeof fallbackData !== "undefined"
				? fallbackData
				: data,
		revalidate,
		isValidating: isKeyFetchable ? fetchingFor.get(key) || false : false,
		error: isKeyFetchable ? errors.get(key) || undefined : undefined,
	};
};

export default useFetch;
