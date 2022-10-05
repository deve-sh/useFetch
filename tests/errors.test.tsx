import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { cleanUpAPICallMocks, setupAPICallMocks } from "./mocks/apiCalls";

import useFetch from "../src/useFetch";

const ComponentWithError = () => {
	const { error } = useFetch("/api/v1", {
		fetcher: async (key) => {
			fetch(key);
			throw new Error("Error message");
		},
	});
	return <>{error?.message || ""}</>;
};

describe("error tests", () => {
	beforeEach(() => {
		setupAPICallMocks();
	});
	afterEach(() => {
		cleanUpAPICallMocks();
	});

	it("should display error as expected", async () => {
		render(<ComponentWithError />);
		await waitFor(() => screen.getByText("Error message"));
		expect(screen.getByText("Error message")).not.toBeNull();
	});
});
