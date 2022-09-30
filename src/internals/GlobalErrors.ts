type listenerFunctionType = (data: Error | any) => any;

export type GlobalErrorsType = {
	errors: Map<string, Error | undefined>;
	subscribe: (listener: listenerFunctionType) => () => void;
	setError: (key: string, error?: Error) => void;
	getErrors: () => Map<string, Error | undefined>;
};

const GlobalErrors = (): GlobalErrorsType => {
	const Errors = new Map();
	const errorStatusSubscribers: Set<listenerFunctionType> = new Set();
	const unsubscriber = (listener: listenerFunctionType) =>
		errorStatusSubscribers.delete(listener);

	return {
		// Subscription setters and getters
		subscribe: function (listener: listenerFunctionType) {
			// Check if listener is already subscribed.
			errorStatusSubscribers.add(listener);
			return () => unsubscriber(listener);
		},

		// errors updater
		setError: function (key: string, error?: Error) {
			Errors.set(key, error);
			// Send signal of update to subscribers for key.
			errorStatusSubscribers.forEach((listenerFunc) => listenerFunc(error));
		},
		get errors() {
			return Errors;
		},
		getErrors: function () {
			return Errors;
		},
	};
};

export default GlobalErrors;
