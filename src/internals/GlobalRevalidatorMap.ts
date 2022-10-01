import Revalidator from "../singleTypes/Revalidator";

// Map to keep track of the time at which data was fetched for a key, used for deduping requests
export type GlobalRevalidatorMapType = Map<string, Revalidator | undefined>;

const GlobalRevalidatorMap = (): GlobalRevalidatorMapType => {
	const RevalidatorMap = new Map() as GlobalRevalidatorMapType;
	return RevalidatorMap;
};

export default GlobalRevalidatorMap;
