#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import hasCarbon from './has-carbon';

const program = new Command();

const greenText = chalk.rgb(154, 226, 46);
const greenCheck = greenText('✔');
const redCross = chalk.red('✘');


program
  .name('carbon-txt-manager')
  .description('A minimalistic terminal-based file manager for carbon.txt files.')
  .version('1.0.0');

// has-carbon
program.command('has-carbon')
  .description('Check if carbon.txt exists in the current working directory')
  .action(() => {
    if (hasCarbon()) {
      console.log(`${greenCheck} ${greenText('carbon.txt')} exists in current working directory.`);
    } else {
      console.log(`${redCross} ${chalk.red('carbon.txt not found!')}`);
    }
  });



  
program.parse();