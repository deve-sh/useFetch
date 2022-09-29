import fetch from "node-fetch";

const defaultFetcher = (key: string): Promise<any> =>
	fetch(key).then((res) => {
		if (!res.ok) throw new Error("Error in request for key: " + key);
		return res.json();
	});

export default defaultFetcher;
