import { useEffect, useState, useMemo, useCallback } from "react";
import { useFetchContext } from "./Provider/useFetchContext";

interface useFetchOptions {
	revalidateOnMount?: boolean;
	revalidateOnFocus?: boolean;
	fallbackData?: any;
	fetcher?: (key: string) => Promise<any>;
}

const useFetch = (key: string, options: useFetchOptions) => {
	const fallbackData =
		options.fallbackData || useFetchContext().fallback?.[key] || undefined;
	const fetcher =
		options.fetcher || useFetchContext().fetcher || (async () => undefined);
	const revalidateOnMount =
		options.revalidateOnMount || useFetchContext().revalidateOnMount || true;
	const revalidateOnFocus =
		options.revalidateOnFocus || useFetchContext().revalidateOnFocus || true;

	const [data, setData] = useState(fallbackData);
	const [error, setError] = useState(undefined);
	const [isValidating, setIsValidating] = useState(false);

	const fetchData = useCallback(async () => {
		setIsValidating(true);
		fetcher(key)
			.then((dataFetched) => {
				setData(dataFetched);
				setIsValidating(false);
				setError(undefined);
			})
			.catch((err) => {
				setData(undefined);
				setError(err);
				setIsValidating(false);
			});
	}, [key]);

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
				setData(updatedData);
				if (revalidateAfterSetting) fetchData();
				return updatedData;
			} else if (typeof updater !== "undefined") {
				setData(updater);
				if (revalidateAfterSetting) fetchData();
			} else fetchData();
		},
		[fetchData]
	);

	return { data, revalidate, isValidating, error };
};

export default useFetch;
