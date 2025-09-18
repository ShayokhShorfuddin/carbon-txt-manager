import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { greenText, redCross, redText } from "./chalk-config";
import { askForDisclosureLoop, template } from "./generate";
import hasCarbon from "./has-carbon";
import { loadContent } from "./validate";

export default async function addDisclosures() {
	// First we will check if the carbon.txt file exists in the current working directory
	if (!hasCarbon()) {
		console.error(`${redCross} ${redText("carbon.txt not found.")}`);
		process.exit(1);
	}

	// Get file content
	const content = loadContent();

	try {
		const disclosures = await askForDisclosureLoop();
		const updatedDisclosures = content.org.disclosures.concat(disclosures);

		// Prepare new carbon.txt file
		const filePath = join(process.cwd(), "carbon.txt");

		await writeFile(
			filePath,
			template({
				disclosures: updatedDisclosures,
				services: content.upstream.services,
			}),
			"utf8",
		);
		console.log(`\n${greenText("New disclosure(s) added successfully.")}`);
	} catch (error) {
		console.error("Error while adding disclosures: ", error);
		process.exit(1);
	}
}
