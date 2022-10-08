type listenerFunctionType = (data: any) => any;

export type GlobalFetchingType = {
	entries: Map<string, boolean>;
	subscribe: (listener: listenerFunctionType) => () => void;
	setFetching: (key: string, fetching: boolean) => void;
};

const GlobalFetching = (): GlobalFetchingType => {
	const Fetching = new Map();
	const fetchingStatusSubscribers: Set<listenerFunctionType> = new Set();
	const unsubscriber = (listener: listenerFunctionType) =>
		fetchingStatusSubscribers.delete(listener);

	return {
		// Subscription setters and getters
		subscribe: function (listener: listenerFunctionType) {
			fetchingStatusSubscribers.add(listener);
			return () => unsubscriber(listener);
		},

		// Fetching updater
		setFetching: function (key: string, fetching: boolean) {
			Fetching.set(key, fetching);
			// Send signal of update to subscribers for key.
			fetchingStatusSubscribers.forEach((listenerFunc) =>
				listenerFunc(Fetching)
			);
		},
		get entries() {
			return Fetching;
		},
	};
};

export default GlobalFetching;
