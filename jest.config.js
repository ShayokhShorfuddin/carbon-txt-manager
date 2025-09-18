import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
	testEnvironment: "node",
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json",
		},
	},
	transform: {
		...tsJestTransformCfg,
	},
};
