import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { cleanUpAPICallMocks, setupAPICallMocks } from "./mocks/apiCalls";

import useFetch from "../src/useFetch";

const CompWithDuplicateHooks = () => {
	const { data } = useFetch("/api/v1", {
		fetcher: async (key) => {
			fetch(key);
			return "FixedData";
		},
	});
	const { data: data1 } = useFetch("/api/v1");
	return <>{data + " " + data1}</>;
};

describe("Duplicate Key Hooks Tests", () => {
	beforeEach(() => {
		setupAPICallMocks();
	});
	afterEach(() => {
		cleanUpAPICallMocks();
	});

	it("should reflect data in hooks with same key", async () => {
		render(<CompWithDuplicateHooks />);
		// Same data should be reflected in both the duplicate hooks
		await waitFor(() => screen.getByText("FixedData FixedData"));
		expect(screen.getByText("FixedData FixedData")).not.toBeNull();
	});
});
