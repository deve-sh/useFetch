import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import {
	cleanUpAPICallMocks,
	getAPICallsList,
	getNTimesAPICallInvoked,
	setupAPICallMocks,
} from "./mocks/apiCalls";

import useFetch from "../src/useFetch";

const ConditionalFetching = ({ shouldFetch = false }) => {
	const { data } = useFetch(shouldFetch ? "/api/v1" : null);
	return data;
};

describe("Conditional Fetching tests", () => {
	beforeEach(() => {
		setupAPICallMocks();
	});
	afterEach(() => {
		cleanUpAPICallMocks();
	});

	it("should implement conditional fetching using key as a valid string", async () => {
		render(<ConditionalFetching shouldFetch />);
		expect(getAPICallsList().length).toBe(1);
		expect(getAPICallsList()[0]).toBe("/api/v1");
		expect(getNTimesAPICallInvoked()).toBe(1);
	});

	it("should implement conditional fetching using key as null", async () => {
		render(<ConditionalFetching />);
		expect(getAPICallsList().length).toBe(0);
		expect(getAPICallsList()[0]).toBeUndefined();
		expect(getNTimesAPICallInvoked()).toBe(0);
	});
});
