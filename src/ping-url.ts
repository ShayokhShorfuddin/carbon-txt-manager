import { greenCheck, greenText, redCross, redText } from "./chalk-config";
import hasCarbon from "./has-carbon";
import isValid, { loadContent } from "./validate";

export default async function pingUrl() {
	// First we will check if the carbon.txt file exists in the current working directory
	if (!hasCarbon()) {
		console.error(`${redCross} ${redText("carbon.txt not found.")}`);
		process.exit(1);
	}

	// Validating the file content for safety
	isValid();

	// Get file content
	const content = loadContent();
	const disclosureUrls = content.org.disclosures.map((d) => d.url);

	// If there are no URLs to ping, exit early
	if (disclosureUrls.length === 0) {
		console.log(`${redCross} No URLs found in disclosures to ping.`);
		return;
	}

	// Ping each URL with a HEAD request
	const promises = disclosureUrls.map((url) => fetch(url, { method: "HEAD" }));

	console.log("Pinging URLs...");

	const results = await Promise.allSettled(promises);

	results.forEach((result, index) => {
		const url = disclosureUrls[index];

		// Could not fetch the URL
		if (result.status === "rejected") {
			console.error(
				`${redCross} URL: ${url}, status: ${redText("failed")}, reason: ${result.reason}`,
			);
			process.exit(1);
		}

		// Successful fetch
		const statusCode = result.value.status;
		const isReachable = result.value.ok;

		// Not within 200-299 range
		if (!result.value.ok) {
			console.error(
				`${redCross} URL: ${url}, status: ${redText(statusCode)}, reachable: ${isReachable}`,
			);
			process.exit(1);
		}

		// Within 200-299 range
		console.log(
			`${greenCheck} URL: ${url}, status: ${greenText(statusCode)}, reachable: ${isReachable}`,
		);
	});
}
