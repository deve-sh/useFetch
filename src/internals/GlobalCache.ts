const Cache = new Map();

type listenerFunctionType = (data: any) => any;
export type GlobalCacheType = {
	entries: Map<string, any>;
	subscribers: listenerFunctionType[];
	subscribe: (listener: listenerFunctionType) => void;
	unsubscribe: (listener: listenerFunctionType) => void;
	setEntry: (key: string, value: any) => void;
	getEntries: () => Map<string, any>;
};

const GlobalCache: GlobalCacheType = {
	entries: Cache,
	// Listeners to Global Cache
	subscribers: [],

	// Subscription setters and getters
	subscribe: function (listener: listenerFunctionType) {
		// Check if listener is already subscribed.
		for (let i = 0; i < this.subscribers.length; i++)
			if (this.subscribers[i] === listener) return;
		this.subscribers.push(listener);
	},
	unsubscribe: function (listener: listenerFunctionType) {
		const listenerIndex = this.subscribers.findIndex(
			(listenerFunc) => listenerFunc === listener
		);
		this.subscribers.splice(listenerIndex, 1);
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
