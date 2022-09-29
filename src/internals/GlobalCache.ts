const Cache = new Map();

type listenerFunctionType = (data: any) => any;
export type GlobalCacheType = {
	entries: Map<string, any>;
	subscribers: Set<listenerFunctionType>;
	subscribe: (listener: listenerFunctionType) => () => void;
	unsubscribe: (listener: listenerFunctionType) => void;
	setEntry: (key: string, value: any) => void;
	getEntries: () => Map<string, any>;
};

const GlobalCache: GlobalCacheType = {
	entries: Cache,
	// Listeners to Global Cache
	subscribers: new Set(),

	// Subscription setters and getters
	subscribe: function (listener: listenerFunctionType) {
		// Check if listener is already subscribed.
		this.subscribers.add(listener);
		return () => this.unsubscribe(listener);
	},
	unsubscribe: function (listener: listenerFunctionType) {
		this.subscribers.delete(listener);
	},

	// Cache updater
	setEntry: function (key: string, value: any) {
		this.entries.set(key, value);
		// Send signal of update to subscribers for key.
		for (const listenerFunc of this.subscribers) listenerFunc(value);
	},
	getEntries: function () {
		return this.entries;
	},
};

export default GlobalCache;
