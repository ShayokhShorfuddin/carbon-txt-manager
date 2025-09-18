import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import inquirer from "inquirer";
import { greenText, redCross, redText } from "./chalk-config";
import { template } from "./generate";
import hasCarbon from "./has-carbon";
import isValid, { loadContent } from "./validate";

export default async function removeDisclosure() {
	// First we will check if the carbon.txt file exists in the current working directory
	if (!hasCarbon()) {
		console.error(`${redCross} ${redText("carbon.txt not found.")}`);
		process.exit(1);
	}

	// Validating the file content for safety
	isValid();

	// Get file content
	const content = loadContent();
	const currentDisclosures = content.org.disclosures.map(
		(disclosure) =>
			`${disclosure.domain}: ${disclosure.doc_type}, ${disclosure.url}`,
	);

	// When disclosures = []
	if (currentDisclosures.length === 0) {
		console.error(`${redCross} ${redText("No existing disclosure.")}`);
		return;
	}

	const {
		targetDisclosure,
	}: {
		targetDisclosure: string;
	} = await inquirer.prompt([
		{
			type: "list",
			name: "targetDisclosure",
			message: "Which disclosure do you want to remove?",
			choices: currentDisclosures,
		},
	]);

	const targetIndex = currentDisclosures.indexOf(targetDisclosure);

	// Remove the selected disclosure from the disclosures array
	content.org.disclosures.splice(targetIndex, 1);

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

	console.log(`${greenText("Disclosure removed successfully.")}`);
}
