// This file enables the functionality of bound mutates when using the global useFetchConfig hook.

import type { FetchProviderProperties } from "../Provider";
import type Revalidator from "../singleTypes/Revalidator";

const registerRevalidator = (
	globalContext: FetchProviderProperties,
	key: string,
	revalidator: Revalidator | undefined
) => {
	if (globalContext) {
		globalContext.revalidators.set(key, revalidator);
	}
};

export default registerRevalidator;
