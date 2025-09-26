# Carbon Txt Manager

A minimalistic terminal-based file manager for `carbon.txt` files, offering syntax validation, URL/domain reachability testing, lightning-fast formatting, easy file viewing, and powerful management tools—all from the comfort of your cozy terminal. 🌿

For information on carbon.txt, please refer to [carbontxt.org](https://carbontxt.org/). The color scheme is based on the one shown in [carbon.txt syntax](https://carbontxt.org/syntax).

### 🌱 Installation
Get started by installing the package as a `devDependency` through the following command:
```shell
npm install carbon-txt-manager --save-dev
```

If you just want to try it out without installing locally, use the following command:
```shell
npx carbon-txt-manager <command>
```

For a global system-wide access, install with the `-g` flag:
```shell
npm install -g carbon-txt-manager
```

### 💻 Usage
#### Local Installation
If you have installed the package locally as a `devDependency`, add the following script to your `package.json`:
```json
"scripts": {
  "ctm": "carbon-txt-manager"
}
```

Then, you can run it using:
```shell
npm run ctm
```
```shell
npm run ctm -- <command>
```

If everything is set up correctly, `npm run ctm` should trigger the help command:

```
PS D:\path\to\codebase> npm run ctm

> carbon-txt-manager@version ctm
> carbon-txt-manager

Usage: carbon-txt-manager [options] [command]

A minimalistic terminal-based file manager for carbon.txt files.

Options:
  -V, --version         output the version number
  -h, --help            display help for command
```

#### Global Installation
If you have installed the package globally, you can run it directly from any project directory.

Try executing `carbon-txt-manager` to trigger the help command.
```
PS D:\path\to\codebase> carbon-txt-manager
Usage: carbon-txt-manager [options] [command]

A minimalistic terminal-based file manager for carbon.txt files.

Options:
  -V, --version         output the version number
  -h, --help            display help for command
```

### 📄 Commands Chart
| Command                 | Description                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| has-carbon \| hc        | Check if carbon.txt exists in the current working directory.                                       |
| generate \| gen         | Generate a new carbon.txt file in the current working directory, overwriting if it already exists. |
| validate \| val         | Validate the syntax and structure of the carbon.txt file in the current working directory.         |
| extension \| ext        | Display information regarding carbon-text vscode extension.                     |
| view \| v               | View the contents of the carbon.txt file in the current working directory.                         |
| tree \| t               | View the structure of carbon.txt file present in the current working directory.                    |
| ping-urls \| pu         | Ping all URLs specified in the disclosures to determine their reachability.                        |
| format \| f             | Format an unformatted carbon.txt file. The file must be syntactically valid.                       |
| add-disclosures \| ad   | Add new disclosures to the disclosures array of an existing carbon.txt file.                       |
| add-services \| as      | Add new services to the services array of an existing carbon.txt file.                             |
| remove-disclosure \| rd | Remove an existing disclosure from the disclosures array of an existing carbon.txt file.           |
| remove-service \| rs    | Remove an existing service from the services array of an existing carbon.txt file.                 |
| help                    | Display help for command.                                                                          |


### Contributing
I would love to accept contributions. If you have any ideas or suggestions, please feel free to [open an issue](https://github.com/ShayokhShorfuddin/carbon-txt-manager/issues) or submit a pull request.

