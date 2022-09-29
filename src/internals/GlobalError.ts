const Errors = new Map();

type listenerFunctionType = (data: Error | any) => any;

export type GlobalErrorsType = {
	errors: Map<string, Error | undefined>;
	subscribers: Set<listenerFunctionType>;
	subscribe: (listener: listenerFunctionType) => () => void;
	unsubscribe: (listener: listenerFunctionType) => void;
	setError: (key: string, error?: Error) => void;
	getErrors: () => Map<string, Error | undefined>;
};

const GlobalErrors: GlobalErrorsType = {
	errors: Errors,

	// Listeners to Global errors
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

	// errors updater
	setError: function (key: string, error?: Error) {
		this.errors.set(key, error);
		// Send signal of update to subscribers for key.
		for (const listenerFunc of this.subscribers) listenerFunc(error);
	},
	getErrors: function () {
		return this.errors;
	},
};

export default GlobalErrors;
