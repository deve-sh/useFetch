const Fetching = new Map();

type listenerFunctionType = (data: any) => any;

export type GlobalFetchingType = {
	entries: Map<string, boolean>;
	subscribers: Record<string, listenerFunctionType[]>;
	subscribe: (key: string, listener: listenerFunctionType) => void;
	unsubscribe: (key: string, listener: listenerFunctionType) => void;
	setFetching: (key: string, fetching: boolean) => void;
};

const GlobalFetching: GlobalFetchingType = {
	entries: Fetching,

	// Listeners to Global Fetching
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

	// Fetching updater
	setFetching: function (key: string, fetching: boolean) {
		this.entries.set(key, fetching);
		// Send signal of update to subscribers for key.
		for (const listenerFunc of this.subscribers[key] || [])
			listenerFunc(fetching);
	},
};

export default GlobalFetching;
