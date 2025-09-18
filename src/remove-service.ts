import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import inquirer from "inquirer";
import { greenText, redCross, redText } from "./chalk-config";
import { template } from "./generate";
import hasCarbon from "./has-carbon";
import isValid, { loadContent } from "./validate";

export default async function removeService() {
	// First we will check if the carbon.txt file exists in the current working directory
	if (!hasCarbon()) {
		console.error(`${redCross} ${redText("carbon.txt not found.")}`);
		process.exit(1);
	}

	// Validating the file content for safety
	isValid();

	// Get file content
	const content = loadContent();
	const currentServices = content.upstream.services.map(
		(service) => `${service.domain}: ${service.service_type.join(", ")}`,
	);

	// When services = []
	if (currentServices.length === 0) {
		console.error(`${redCross} ${redText("No existing service.")}`);
		return;
	}

	const {
		targetService,
	}: {
		targetService: string;
	} = await inquirer.prompt([
		{
			type: "list",
			name: "targetService",
			message: "Which service do you want to remove?",
			choices: currentServices,
		},
	]);

	const targetIndex = currentServices.indexOf(targetService);

	// Remove the selected service from the services array
	content.upstream.services.splice(targetIndex, 1);

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

	console.log(`${greenText("service removed successfully.")}`);
}
