let apiCallsList: string[] = [];
let nTimesInvoked = 0;

export const setupAPICallMocks = () => {
	// @ts-ignore
	global.fetch = async (url: string) => {
		apiCallsList.push(url);
		nTimesInvoked++;
	};
};

export const getAPICallsList = () => apiCallsList;
export const getNTimesAPICallInvoked = () => nTimesInvoked;
export const cleanUpAPICallMocks = () => {
	apiCallsList = [];
	nTimesInvoked = 0;
};
