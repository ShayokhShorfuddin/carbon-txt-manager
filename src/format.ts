import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { greenText, redCross, redText } from "./chalk-config";
import { template } from "./generate";
import hasCarbon from "./has-carbon";
import isValid, { loadContent } from "./validate";

export default async function format() {
	// First we will check if the carbon.txt file exists in the current working directory
	if (!hasCarbon()) {
		console.error(`${redCross} ${redText("carbon.txt not found.")}`);
		process.exit(1);
	}

	// Validating the file content for safety
	isValid();

	// Get file content
	const content = loadContent();

	// Prepare new carbon.txt file
	const filePath = join(process.cwd(), "carbon.txt");

	await writeFile(
		filePath,
		template({
			disclosures: content.org.disclosures,
			services: content.upstream.services,
		}),
		"utf8",
	);
	console.log(`${greenText("carbon.txt")} formatted successfully.`);
}
