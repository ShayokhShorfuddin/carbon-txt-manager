import chalk from "chalk";

const greenText = chalk.rgb(154, 226, 46);
const redText = chalk.red;

const greenCheck = greenText("✔");
const redCross = redText("✘");

export { greenText, redText, greenCheck, redCross };
