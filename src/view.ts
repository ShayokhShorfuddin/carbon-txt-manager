import fs from "node:fs";
import { redCross, redText } from "./chalk-config";
import hasCarbon from "./has-carbon";

export default async function viewCarbonTxt() {
	if (!hasCarbon()) {
		console.error(
			`${redCross} ${redText("carbon.txt not found in current working directory.")}`,
		);
		process.exit(1);
	}

	// Read and print the contents of carbon.txt
	const content = fs.readFileSync("carbon.txt", "utf-8");
	console.log(content);
}
