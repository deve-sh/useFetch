// Map to keep track of the keys for which revalidate on focus event has been registered.

export type GlobalFocusRevalidationEventSetType = Map<string, boolean>;

const GlobalFocusRevalidationEventSet =
	(): GlobalFocusRevalidationEventSetType => {
		const OnFocusRevalidationAlreadySet = new Map();
		return OnFocusRevalidationAlreadySet;
	};

export default GlobalFocusRevalidationEventSet;
