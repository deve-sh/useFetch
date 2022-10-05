import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import {
	cleanUpAPICallMocks,
	getAPICallsList,
	getNTimesAPICallInvoked,
	setupAPICallMocks,
} from "./mocks/apiCalls";

import useFetch from "../src/useFetch";

const FetchWithCustomFetcher = () => {
	const { data } = useFetch("/api/v1", {
		fetcher: async (key) => {
			fetch(key);
			return "FixedData";
		},
	});
	return data;
};

describe("Custom fetcher tests", () => {
	beforeEach(() => {
		setupAPICallMocks();
	});
	afterEach(() => {
		cleanUpAPICallMocks();
	});

	it("should work with custom fetcher passed", async () => {
		render(<FetchWithCustomFetcher />);
		expect(getAPICallsList().length).toBe(1);
		expect(getAPICallsList()[0]).toBe("/api/v1");
		expect(getNTimesAPICallInvoked()).toBe(1);
		await waitFor(() => screen.getByText("FixedData"));
		expect(screen.getByText("FixedData")).not.toBeNull();
	});
});
