import React, { createContext } from "react";

import GlobalCache from "../internals/GlobalCache";
import GlobalFallback from "../internals/GlobalFallback";
import GlobalFetching from "../internals/GlobalFetching";

const defaultProviderValue = {
	cache: GlobalCache,
	isFetching: GlobalFetching,
	fallback: GlobalFallback,
	revalidateOnMount: true,
	dedupingInterval: 2000,
	onSuccess: undefined,
	onError: undefined,
	revalidateOnFocus: false,
};

export interface FetchProviderArgs {
	cache?: Map<string, any>;
	fallback?: { [key: string]: any };
	fetcher?: (key: string) => Promise<any>;
	revalidateOnMount?: boolean;
	dedupingInterval?: number;
	onSuccess?: (data: any, key: string, config: Record<string, any>) => any;
	onError?: (err: Error, key: string, config: Record<string, any>) => any;
	revalidateOnFocus?: boolean;
}

export const FetchProviderContext =
	createContext<FetchProviderArgs>(defaultProviderValue);

export default FetchProviderContext.Provider;
