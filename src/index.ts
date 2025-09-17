#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

import { Command } from 'commander';

const program = new Command();

program
  .name('carbon-txt-manager')
  .description('A minimalistic terminal-based file manager for carbon.txt files.')
  .version('1.0.0');

  
// COLOR CODES
// #9D79DB", "#A6E22E", "#9AE22E"

// Check if carbon.txt exists in the current working directory
// This does seem to work. Prettify it, make it green tick and a link to the carbon.txt file.
program.command('has-carbon')
  .description('Check if carbon.txt exists in the current working directory')
  .action(() => {
    const filePath = path.join(process.cwd(), 'carbon.txt');
    if (fs.existsSync(filePath)) {
      console.log('carbon.txt exists in the current directory.');
    
    } else {
      console.log('carbon.txt does not exist in the current directory.');
    }
  });
  
program.parse();