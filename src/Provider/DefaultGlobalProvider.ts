import GlobalCache from "../internals/GlobalCache";
import GlobalErrors from "../internals/GlobalErrors";
import GlobalFallback from "../internals/GlobalFallback";
import GlobalFetching from "../internals/GlobalFetching";
import GlobalFocusRevalidationEventSet from "../internals/GlobalFocusRevalidationEventSet";
import GlobalLastFetched from "../internals/GlobalLastFetched";
import GlobalRevalidatorMap from "../internals/GlobalRevalidatorMap";

import defaultFetcher from "./defaultFetcher";

// In case a FetchProvider has not been added as a wrapper. Pick up the config from this.
export const defaultProviderValue = {
	cache: GlobalCache(),
	fetching: GlobalFetching(),
	errors: GlobalErrors(),
	lastFetched: GlobalLastFetched(),
	revalidators: GlobalRevalidatorMap(),
	revalidateOnFocusEventSetFor: GlobalFocusRevalidationEventSet(),
	fallback: GlobalFallback,
	revalidateOnMount: true,
	revalidateOnFocus: false,
	dedupingInterval: 2000,
	onSuccess: undefined,
	onError: undefined,
	fetcher: defaultFetcher,
};

export default defaultProviderValue;
