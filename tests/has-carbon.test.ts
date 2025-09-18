import fs from "node:fs";
import hasCarbon from "../src/has-carbon";

// Mock fs.existsSync to control its behavior in tests
jest.mock("node:fs");

const mockedFs = fs as jest.Mocked<typeof fs>;

describe("hasCarbon", () => {
	const originalCwd = process.cwd;

	beforeAll(() => {
		process.cwd = jest.fn().mockReturnValue("/mocked/path");
	});

	afterAll(() => {
		process.cwd = originalCwd;
	});

	it("returns true when carbon.txt exists", () => {
		mockedFs.existsSync.mockReturnValue(true);
		expect(hasCarbon()).toBe(true);
	});

	it("returns false when carbon.txt does not exist", () => {
		mockedFs.existsSync.mockReturnValue(false);
		expect(hasCarbon()).toBe(false);
	});
});
