#!/usr/bin/env node

import { Command } from "commander";
import { greenCheck, greenText, redCross, redText } from "./chalk-config";
import extension from "./extension";
import generate from "./generate";
import hasCarbon from "./has-carbon";
import tree from "./tree";
import isValid from "./validate";
import viewCarbonTxt from "./view";

const program = new Command();

program
	.name("carbon-txt-manager")
	.description(
		"A minimalistic terminal-based file manager for carbon.txt files.",
	)
	.version("1.0.0");

// has-carbon
program
	.command("has-carbon")
	.description("Check if carbon.txt exists in the current working directory")
	.action(() => {
		if (hasCarbon()) {
			console.log(
				`${greenCheck} ${greenText("carbon.txt")} exists in current working directory.`,
			);
		} else {
			console.error(`${redCross} ${redText("carbon.txt not found.")}`);
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
	.description("Print information about the carbon-text extension")
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

program.parse();
