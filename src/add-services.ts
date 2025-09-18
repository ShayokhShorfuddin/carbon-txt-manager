import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { greenText, redCross, redText } from "./chalk-config";
import { askForServicesLoop, template } from "./generate";
import hasCarbon from "./has-carbon";
import isValid, { loadContent } from "./validate";

export default async function addServices() {
	// First we will check if the carbon.txt file exists in the current working directory
	if (!hasCarbon()) {
		console.error(`${redCross} ${redText("carbon.txt not found.")}`);
		process.exit(1);
	}
	// Validating the file content for safety
	isValid();

	// Get file content
	const content = loadContent();

	try {
		const services = await askForServicesLoop();
		const updatedServices = content.upstream.services.concat(services);

		// Prepare new carbon.txt file
		const filePath = join(process.cwd(), "carbon.txt");

		await writeFile(
			filePath,
			template({
				disclosures: content.org.disclosures,
				services: updatedServices,
			}),
			"utf8",
		);
		console.log(`\n${greenText("New service(s) added successfully.")}`);
	} catch (error) {
		console.error("Error while adding services: ", error);
		process.exit(1);
	}
}
