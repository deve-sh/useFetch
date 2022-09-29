import { createContext, PropsWithChildren } from "react";
import { defaultProviderValue } from "./DefaultGlobalProvider";

import GlobalCache, { GlobalCacheType } from "../internals/GlobalCache";

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
	cache?: GlobalCacheType;
}

export const FetchProviderContext =
	createContext<FetchProviderArgs>(defaultProviderValue);

interface FetchProviderProps extends PropsWithChildren {
	value: FetchProviderContextValue;
}

const FetchProvider = ({ children, value }: FetchProviderProps) => {
	return (
		<FetchProviderContext.Provider value={{ ...value, cache: GlobalCache }}>
			{children}
		</FetchProviderContext.Provider>
	);
};

export default FetchProvider;
