import { createContext } from "react";
import { defaultProviderValue } from "./DefaultGlobalProvider";
import GlobalCache from "../internals/GlobalCache";

export interface FetchProviderArgs {
	cache?: typeof GlobalCache;
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
