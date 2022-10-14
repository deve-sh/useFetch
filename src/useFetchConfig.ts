import useFetchContext from "./Provider/useFetchContext";
import globalProvider from "./Provider/defaultGlobalProvider";

const useFetchConfig = () => {
	const contextToReferTo = useFetchContext() || globalProvider;

	const revalidate = (
		key: string,
		updater?: () => Promise<any> | any,
		revalidateAfterSetting?: boolean
	) => {
		return contextToReferTo.revalidators.get(key)?.(
			updater,
			revalidateAfterSetting
		);
	};

	return {
		revalidate,
		fetcher: contextToReferTo.fetcher,
		fallback: contextToReferTo.fallback,
		cache: contextToReferTo.cache.entries,
		dedupingInterval: contextToReferTo.dedupingInterval,
		revalidateOnMount: contextToReferTo.revalidateOnMount,
		revalidateOnFocus: contextToReferTo.revalidateOnFocus,
	};
};

export default useFetchConfig;
