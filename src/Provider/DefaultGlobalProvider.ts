import GlobalCache from "../internals/GlobalCache";
import GlobalFallback from "../internals/GlobalFallback";
import GlobalFetching from "../internals/GlobalFetching";

import defaultFetcher from "./defaultFetcher";

export const defaultProviderValue = {
	cache: GlobalCache,
	isFetching: GlobalFetching,
	fallback: GlobalFallback,
	revalidateOnMount: true,
	revalidateOnFocus: false,
	dedupingInterval: 2000,
	onSuccess: undefined,
	onError: undefined,
	fetcher: defaultFetcher,
};

// In case a FetchProvider has not been added as a wrapper. Pick up the config from this.
const globalProvider = { ...defaultProviderValue };

export default globalProvider;
