type listenerFunctionType = (data: any) => any;
export type GlobalCacheType = {
	subscribe: (listener: listenerFunctionType) => () => void;
	setEntry: (key: string, value: any) => void;
	getEntries: () => Map<string, any>;
	entries: Map<string, any>;
};

const GlobalCache = (): GlobalCacheType => {
	const cache = new Map();
	const cacheSubscribers: Set<listenerFunctionType> = new Set();
	const unsubscriber = (listener: listenerFunctionType) =>
		cacheSubscribers.delete(listener);

	return {
		// Subscription setters and getters
		subscribe(listener: listenerFunctionType) {
			// Check if listener is already subscribed.
			cacheSubscribers.add(listener);
			return () => unsubscriber(listener);
		},

		get entries() {
			return cache;
		},

		// Cache updater
		setEntry(key: string, value: any) {
			cache.set(key, value);
			// Send signal of update to subscribers for key.
			cacheSubscribers.forEach((listenerFunc) => listenerFunc(cache));
		},
		getEntries() {
			return cache;
		},
	};
};

export default GlobalCache;
