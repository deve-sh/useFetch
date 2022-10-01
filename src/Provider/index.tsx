import { createContext, PropsWithChildren, useMemo } from "react";
import { defaultProviderValue } from "./DefaultGlobalProvider";

import GlobalCache, { GlobalCacheType } from "../internals/GlobalCache";
import GlobalFetching, {
	GlobalFetchingType,
} from "../internals/GlobalFetching";
import GlobalErrors, { GlobalErrorsType } from "../internals/GlobalErrors";
import GlobalLastFetched, {
	GlobalLastFetchedType,
} from "../internals/GlobalLastFetched";

interface FetchProviderContextValue {
	fallback?: { [key: string]: any };
	fetcher?: (key: string) => Promise<any>;
	revalidateOnMount?: boolean;
	revalidateOnFocus?: boolean;
	dedupingInterval?: number;
	onSuccess?: (data: any, key: string, config: Record<string, any>) => any;
	onError?: (err: Error, key: string, config: Record<string, any>) => any;
}

export interface FetchProviderArgs extends FetchProviderContextValue {
	cache: GlobalCacheType;
	fetching: GlobalFetchingType;
	errors: GlobalErrorsType;
	lastFetched: GlobalLastFetchedType;
}

export const FetchProviderContext =
	createContext<FetchProviderArgs>(defaultProviderValue);

interface FetchProviderProps extends PropsWithChildren {
	value: FetchProviderContextValue;
}

const FetchProvider = ({ children, value }: FetchProviderProps) => {
	const contextValue = useMemo(
		() => ({
			...value,
			cache: GlobalCache(),
			fetching: GlobalFetching(),
			errors: GlobalErrors(),
			lastFetched: GlobalLastFetched(),
		}),
		[value]
	);
	return (
		<FetchProviderContext.Provider value={contextValue}>
			{children}
		</FetchProviderContext.Provider>
	);
};

export default FetchProvider;
