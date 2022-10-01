// Map to keep track of the time at which data was fetched for a key, used for deduping requests
export type GlobalLastFetchedType = Map<string, number>;

const GlobalLastFetched = (): GlobalLastFetchedType => {
	const LastFetched = new Map();
	return LastFetched;
};

export default GlobalLastFetched;
