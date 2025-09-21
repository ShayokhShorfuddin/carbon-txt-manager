import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import inquirer from "inquirer";
import { greenText, redCross, redText } from "./chalk-config";

export default async function generate() {
	let disclosures: Array<{ doc_type: string; url: string; domain: string }> =
		[];
	let services: Array<{
		domain: string;
		service_type: Array<string>;
	}> = [];

	try {
		// Since the user is now creating a fresh new file, at first we need to ask them if they would like to add a disclosures/services or would they like to skip this step for now, which will result in an empty array for both disclosures and services.
		const { disclosure_decision }: { disclosure_decision: "Yes" | "Skip" } =
			await inquirer.prompt([
				{
					type: "list",
					name: "disclosure_decision",
					message: "Would you like to add disclosures now?",
					choices: ["Yes", "Skip"],
				},
			]);

		// If the user decides to add disclosures, we will enter a loop where we will keep asking them to add disclosures until they decide to stop.
		if (disclosure_decision === "Yes") {
			disclosures = await askForDisclosureLoop();
		}

		const { service_decision }: { service_decision: "Yes" | "Skip" } =
			await inquirer.prompt([
				{
					type: "list",
					name: "service_decision",
					message: "Would you like to add services now?",
					choices: ["Yes", "Skip"],
				},
			]);

		// If the user decides to add services, we will enter a loop where we will keep asking them to add services until they decide to stop.
		if (service_decision === "Yes") {
			services = await askForServicesLoop();
		}

		// Now that we have collected all disclosures and services, we can proceed with generating the carbon.txt file.
		await generateCarbonTxt({ disclosures, services });
	} catch {
		console.error(`\n${redCross} ${redText("An unexpected error occurred. Please try again.")}`);
		process.exit(1);
	}
}

async function generateCarbonTxt({
	disclosures,
	services,
}: {
	disclosures: Array<{ doc_type: string; url: string; domain: string }>;
	services: Array<{ domain: string; service_type: Array<string> }>;
}) {
	// Prepare new carbon.txt file
	const filePath = join(process.cwd(), "carbon.txt");

	await writeFile(filePath, template({ disclosures, services }), "utf8");
	console.log(`\n${greenText("carbon.txt")} file generated successfully.`);
}

export async function askForDisclosureLoop(): Promise<
	Array<{ doc_type: string; url: string; domain: string }>
> {
	const addMore = true;
	const disclosures: Array<{ doc_type: string; url: string; domain: string }> =
		[];

	while (addMore) {
		const {
			doc_type,
			url,
			domain,
			addMore,
		}: {
			doc_type: string;
			url: string;
			domain: string;
			addMore: "Yes" | "No";
		} = await inquirer.prompt([
			{
				type: "list",
				name: "doc_type",
				message: "Select the document type:",
				choices: [
					"web-page",
					"annual-report",
					"sustainability-page",
					"certificate",
					"csrd-report",
					"other",
				],
			},

			{
				type: "input",
				name: "url",
				message: "Enter the URL of the document:",
				validate: (input: string) => {
					return input.startsWith("http://") || input.startsWith("https://")
						? true
						: 'URL must start with "http://" or "https://"';
				},
			},

			{
				type: "input",
				name: "domain",
				message: "Enter the domain name of the document:",
				validate: (input: string) => {
					return (
						isValidDomain(input) ||
						"Invalid domain name.\nValid examples: google.com, my-website.co.uk, sub.domain.net\nDo not include protocol (http:// or https://) or any content paths (e.g. /news/, /about, news-update-2025 etc.)"
					);
				},
			},

			{
				type: "list",
				name: "addMore",
				message: "Would you like to add another disclosure?",
				choices: ["Yes", "No"],
			},
		]);

		// Add the new disclosure to the disclosures array.
		disclosures.push({ doc_type, url, domain });

		// If the user decides not to add more disclosures, we exit the loop.
		if (addMore === "No") {
			break;
		}
	}

	return disclosures;
}

export async function askForServicesLoop(): Promise<
	Array<{ domain: string; service_type: Array<string> }>
> {
	const addMore = true;
	const services: Array<{
		domain: string;
		service_type: Array<string>;
	}> = [];

	while (addMore) {
		let {
			domain,
			service_type,
			addMore,
		}: {
			domain: string;
			service_type: string;
			addMore: "Yes" | "No";
		} = await inquirer.prompt([
			{
				type: "input",
				name: "domain",
				message:
					"Enter the domain of the organization providing the upstream service:",
				validate: (input: string) => {
					return (
						isValidDomain(input) ||
						"Invalid domain name.\nValid examples: vercel.com, cloud.google.com, aws.amazon.com\nDo not include protocol (http:// or https://) or any content paths (e.g. /news/, /about, news-update-2025 etc.)"
					);
				},
			},

			{
				type: "input",
				name: "service_type",
				message:
					"Enter the type(s) of service provided, separated by commas (e.g. 'shared-hosting, cdn, database ...'):",
				validate: (input: string) => {
					// Ensure that the input is not empty.
					if (input.trim().length < 1) {
						return "Service type must not be empty. For multiple services, separate them with commas (e.g. 'shared-hosting, cdn, database ...')";
					}

					return true;
				},
			},

			{
				type: "list",
				name: "addMore",
				message: "Would you like to add another service?",
				choices: ["Yes", "No"],
			},
		]);

		// If user accidentally wrapped service types in quotes, we will remove them.
		if (
			(service_type.startsWith("'") || service_type.startsWith('"')) &&
			(service_type.endsWith("'") || service_type.endsWith('"'))
		) {
			service_type = service_type.slice(1, -1);
		}

		// Add the new service to the services array.
		services.push({
			domain,
			service_type: service_type.split(",").map((s) => s.trim()),
		});

		// If the user decides not to add more services, we exit the loop.
		if (addMore === "No") {
			break;
		}
	}

	return services;
}

export function template({
	disclosures,
	services,
}: {
	disclosures: Array<{ doc_type: string; url: string; domain: string }>;
	services: Array<{ domain: string; service_type: Array<string> }>;
}) {
	const formattedDisclosures =
		disclosures.length > 0
			? `\n${disclosures
					.map(
						(d) =>
							`    { doc_type = "${d.doc_type}", url = "${d.url}", domain = "${d.domain}" }`,
					)
					.join(",\n")}\n`
			: "";

	const formattedServices =
		services.length > 0
			? `\n${services
					.map(
						(s) =>
							`    { domain = "${s.domain}", service_type = [${s.service_type
								.map((t) => `"${t}"`)
								.join(", ")}] }`,
					)
					.join(",\n")}\n`
			: "";

	return `[org]
disclosures = [${formattedDisclosures}]

[upstream]
services = [${formattedServices}]`;
}

function isValidDomain(url: string): boolean {
	// The domain for which the disclosure applies. This can include any subdomains (e.g. "www."), but should not include the protocol (i.e. "http://" or "https://") or any content paths (e.g "/news/", "/about", "news-update-2025" etc.).
	const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
	return domainRegex.test(url);
}
