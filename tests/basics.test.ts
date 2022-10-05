import { describe, it, expect } from "@jest/globals";
import useFetch from "../src/useFetch";

describe("Basic Tests", () => {
	it("should be a hook function", () => {
		expect(useFetch).toBeInstanceOf(Function);
	});

	it("should expect 1 necessary argument", () => {
		expect(useFetch.length).toBe(1);
	});
});
