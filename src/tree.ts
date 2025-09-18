import { greenText, purpleText, redCross, redText } from "./chalk-config";
import hasCarbon from "./has-carbon";
import isValid, { type Content, loadContent } from "./validate";

export default async function tree() {
	// First we will check if the carbon.txt file exists in the current working directory
	if (!hasCarbon()) {
		console.error(`${redCross} ${redText("carbon.txt not found.")}`);
		process.exit(1);
	}

	// Validating the file content for safety
	isValid();

	// Get file content
	const content = loadContent();

	console.log(template(content));
}

function template(content: Content): string {
	const lines: string[] = [];

	/* ---------- helper: push one line ---------- */
	const push = (text: string, depth: number, last = false) => {
		const prefix =
			depth === 0 ? "" : "│   ".repeat(depth - 1) + (last ? "└── " : "├── ");
		lines.push(prefix + text);
	};

	/* ---------- walk ---------- */
	push("[org]", 0);
	push(purpleText("disclosures"), 1);
	content.org.disclosures.forEach((d, i) => {
		const last = i === content.org.disclosures.length - 1;
		push(
			`{ doc_type: ${greenText(`"${d.doc_type}"`)}, url: ${greenText(`"${d.url}"`)}, domain: ${greenText(`"${d.domain}"`)} }`,
			2,
			last,
		);
	});

	push("[upstream]", 0);
	push(purpleText("services"), 1);
	content.upstream.services.forEach((s, i) => {
		const last = i === content.upstream.services.length - 1;
		push(
			`{ domain: ${greenText(`"${s.domain}"`)}, service_type: [${s.service_type.map((t) => greenText(`"${t}"`)).join(", ")}] }`,
			2,
			last,
		);
	});

	return lines.join("\n");
}
