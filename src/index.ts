#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { Command } from "commander";
import addDisclosures from "./add-disclosures";
import addServices from "./add-services";
import { greenCheck, greenText, redCross, redText } from "./chalk-config";
import extension from "./extension";
import format from "./format";
import generate from "./generate";
import hasCarbon from "./has-carbon";
import pingUrl from "./ping-url";
import removeDisclosure from "./remove-disclosure";
import removeService from "./remove-service";
import tree from "./tree";
import isValid from "./validate";
import viewCarbonTxt from "./view";

const program = new Command();

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

program
	.name("carbon-txt-manager")
	.description(
		"A minimalistic terminal-based file manager for carbon.txt files.",
	)
	.version(packageJson.version);

// has-carbon
program
	.command("has-carbon")
	.description("Check if carbon.txt exists in the current working directory")
	.alias("hc")
	.action(() => {
		if (hasCarbon()) {
			console.log(
				`${greenCheck} ${greenText("carbon.txt")} exists in the current working directory.`,
			);
		} else {
			console.error(
				`${redCross} ${redText("carbon.txt not found in the current working directory.")}`,
			);
			process.exit(1);
		}
	});

// generate
program
	.command("generate")
	.description(
		"Generate a new carbon.txt file in the current working directory, overwriting if it already exists",
	)
	.alias("gen")
	.action(async () => {
		await generate();
	});

// validate
program
	.command("validate")
	.description(
		"Validate the syntax and structure of the carbon.txt file in the current working directory",
	)
	.alias("val")
	.action(() => {
		if (isValid()) {
			console.log(`${greenCheck} ${greenText("carbon.txt is valid.")}`);
		}
	});

// extension
program
	.command("extension")
	.description("Display information regarding carbon-text vscode extension")
	.alias("ext")
	.action(() => {
		extension();
	});

// view
program
	.command("view")
	.description(
		"View the contents of the carbon.txt file in the current working directory",
	)
	.alias("v")
	.action(() => {
		viewCarbonTxt();
	});

// tree
program
	.command("tree")
	.description(
		"View the structure of carbon.txt file present in the current working directory",
	)
	.alias("t")
	.action(() => {
		tree();
	});

// ping-urls
program
	.command("ping-urls")
	.description(
		"Ping all URLs specified in the disclosures to determine their reachability",
	)
	.alias("pu")
	.action(async () => {
		await pingUrl();
	});

// format
program
	.command("format")
	.description(
		"Format an unformatted carbon.txt file. The file must be syntactically valid.",
	)
	.alias("f")
	.action(async () => {
		await format();
	});

// add-disclosures
program
	.command("add-disclosures")
	.description(
		"Add new disclosures to the disclosures array of an existing carbon.txt file.",
	)
	.alias("ad")
	.action(async () => {
		await addDisclosures();
	});

// add-services
program
	.command("add-services")
	.description(
		"Add new services to the services array of an existing carbon.txt file.",
	)
	.alias("as")
	.action(async () => {
		await addServices();
	});

// remove-disclosures
program
	.command("remove-disclosure")
	.description(
		"Remove an existing disclosure from the disclosures array of an existing carbon.txt file.",
	)
	.alias("rd")
	.action(async () => {
		await removeDisclosure();
	});

// remove-service
program
	.command("remove-service")
	.description(
		"Remove an existing service from the services array of an existing carbon.txt file.",
	)
	.alias("rs")
	.action(async () => {
		await removeService();
	});

program.parse();
