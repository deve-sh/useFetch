import isUndefined from "./isUndefined";

const resolveIfNotUndefined = (...values: any[]) => {
	let resolvedValue;
	for (let value of values) {
		if (!isUndefined(value)) {
			resolvedValue = value;
			return resolvedValue;
		}
	}
	return values[values.length - 1];
};

export default resolveIfNotUndefined;
