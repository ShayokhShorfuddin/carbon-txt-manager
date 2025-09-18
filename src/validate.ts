import fs from "node:fs";
import path from "node:path";
import TOML from "@iarna/toml";
import { redCross, redText } from "./chalk-config";
import hasCarbon from "./has-carbon";

export type Content = {
	org: {
		disclosures: { doc_type: string; url: string; domain: string }[];
	};
	upstream: {
		services: { domain: string; service_type: Array<string> }[];
	};
};

export default function isValid(): boolean {
	// First we will check if the carbon.txt file exists in the current working directory
	if (!hasCarbon()) {
		console.error(`${redCross} ${redText("carbon.txt not found.")}`);
		process.exit(1);
	}

	const TOMLContent = loadContent();

	// Check if org table exists
	if (!TOMLContent.org) {
		console.error(`${redCross} ${redText("[org] table is missing.")}`);
		process.exit(1);
	}

	// Check if upstream table exists
	if (!TOMLContent.upstream) {
		console.error(`${redCross} ${redText("[upstream] table is missing.")}`);
		process.exit(1);
	}

	// Check if disclosures array exists in org table
	if (!TOMLContent.org?.disclosures) {
		console.error(
			`${redCross} ${redText(
				'"disclosures" array is missing in [org] table.',
			)}`,
		);

		process.exit(1);
	}

	// Check if services array exists in upstream table
	if (!TOMLContent.upstream?.services) {
		console.error(
			`${redCross} ${redText(
				'"services" array is missing in [upstream] table.',
			)}`,
		);

		process.exit(1);
	}

	// Get all entries in disclosures array that are missing any of the required fields
	const missingDisclosures = TOMLContent.org.disclosures.filter((entry) => {
		return !entry.doc_type || !entry.url || !entry.domain;
	});

	if (missingDisclosures.length > 0) {
		console.error(
			`${redCross} ${redText(
				`The following entries in "disclosures" array are missing required fields (doc_type, url, domain):\n  ${missingDisclosures
					.map((e) => JSON.stringify(e))
					.join(`\n`)}`,
			)}`,
		);
		process.exit(1);
	}

	// Get all entries in services array that are missing any of the required fields
	const missingServices = TOMLContent.upstream.services.filter((entry) => {
		return !entry.domain || !entry.service_type;
	});

	if (missingServices.length > 0) {
		console.error(
			`${redCross} ${redText(`The following entries in "services" array are missing required fields (domain, service_type):\n  ${missingServices.map((e) => JSON.stringify(e)).join(`\n`)}`)}`,
		);
		process.exit(1);
	}

	// Basically, @iarna-toml doesn't properly validate the type of service_type. So we will do it manually. This is important for situations like this: { domain = "vercel.com", service_type = 1 }

	// Iterate over all disclosures and check if doc_type, url, and domain are strings
	const badDisclosures = TOMLContent.org.disclosures.filter(
		(disclosure) =>
			!isString(disclosure.doc_type) ||
			!isString(disclosure.url) ||
			!isString(disclosure.domain),
	);

	if (badDisclosures.length > 0) {
		console.error(
			`${redCross} ${redText(`doc_type, url, and domain must be string for the following entries:\n  ${badDisclosures.map((e) => JSON.stringify(e)).join(`\n`)}`)}`,
		);
		process.exit(1);
	}

	// Iterate over all services and check if domain is a string and service_type is an array of strings
	const badServices = TOMLContent.upstream.services.filter(
		(service) =>
			!isString(service.domain) || !isStringArray(service.service_type),
	);

	if (badServices.length > 0) {
		console.error(
			`${redCross} ${redText(`domain must be a string and service_type must be an array of strings for the following entries:\n  ${badServices.map((e) => JSON.stringify(e)).join(`\n`)}`)}`,
		);
		process.exit(1);
	}

	return true;
}

export function loadContent(): Content {
	try {
		const content = fs.readFileSync(
			path.join(process.cwd(), "carbon.txt"),
			"utf-8",
		);

		return TOML.parse(content) as Content;
	} catch (error) {
		console.error(
			`${redCross} ${redText("Failed to parse carbon.txt")}\n${error}`,
		);
		process.exit(1);
	}
}

///// Type guards /////
function isStringArray(param: string[]): param is string[] {
	return Array.isArray(param) && param.every((i) => typeof i === "string");
}

function isString(param: unknown): param is string {
	return typeof param === "string";
}
