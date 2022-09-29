const Fetching = new Map();

type listenerFunctionType = (data: any) => any;

export type GlobalFetchingType = {
	entries: Map<string, boolean>;
	subscribers: Set<listenerFunctionType>;
	subscribe: (listener: listenerFunctionType) => () => void;
	unsubscribe: (listener: listenerFunctionType) => void;
	setFetching: (key: string, fetching: boolean) => void;
	getFetching: () => Map<string, boolean>;
};

const GlobalFetching: GlobalFetchingType = {
	entries: Fetching,

	// Listeners to Global Fetching
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

	// Fetching updater
	setFetching: function (key: string, fetching: boolean) {
		this.entries.set(key, fetching);
		// Send signal of update to subscribers for key.
		for (const listenerFunc of this.subscribers) listenerFunc(fetching);
	},
	getFetching: function () {
		return this.entries;
	},
};

export default GlobalFetching;
