const Cache = new Map();

type listenerFunctionType = (data: any) => any;

const GlobalCache = (
	CacheProvider: Record<string, any> | Map<string, any> = Cache
) => ({
	entries: CacheProvider,
	// Listeners to Global Cache
	subscribers: {} as Record<string, Array<listenerFunctionType>>,

	// Subscription setters and getters
	subscribe: function (key: string, listener: listenerFunctionType) {
		if (this.subscribers[key]) {
			// Check if listener is already subscribed.
			for (let i = 0; i < this.subscribers[key].length; i++)
				if (this.subscribers[key][i] === listener) return;
			this.subscribers[key].push(listener);
		} else this.subscribers[key] = [listener];
	},
	unsubscribe: function (key: string, listener: listenerFunctionType) {
		const listenerIndex = this.subscribers[key].findIndex(
			(listenerFunc) => listenerFunc === listener
		);
		this.subscribers[key].splice(listenerIndex, 1);
	},

	// Cache updater
	setEntry: function (key: string, value: any) {
		this.entries.set(key, value);
		// Send signal of update to subscribers for key.
		for (const listenerFunc of this.subscribers[key] || []) listenerFunc(value);
	},
});

export default GlobalCache;
