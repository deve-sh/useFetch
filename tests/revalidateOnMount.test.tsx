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

const RevalidateOnMount = ({ revalidateOnMount = false }) => {
	const { data } = useFetch("/api/v1", { revalidateOnMount });
	return data;
};

describe("revalidateOnMount tests", () => {
	beforeEach(() => {
		setupAPICallMocks();
	});
	afterEach(() => {
		cleanUpAPICallMocks();
	});

	it("should work with revalidateOnMount passed as true", () => {
		render(<RevalidateOnMount revalidateOnMount />);
		expect(getAPICallsList().length).toBe(1);
		expect(getAPICallsList()[0]).toBe("/api/v1");
		expect(getNTimesAPICallInvoked()).toBe(1);
	});

	it("should work with revalidateOnMount passed as false", () => {
		render(<RevalidateOnMount />);
		expect(getAPICallsList().length).toBe(0);
		expect(getAPICallsList()[0]).toBe(undefined);
		expect(getNTimesAPICallInvoked()).toBe(0);
	});
});
