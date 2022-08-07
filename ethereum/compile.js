//core module
const path = require("path");
//npm modules
const solc = require("solc");
const fs = require("fs-extra");

//delete entire 'build' folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

//read 'intelifactory.sol' from the 'contracts' folder
const inteliFactoryPath = path.resolve(
  __dirname,
  "contracts",
  "intelifactory.sol"
);
const source = fs.readFileSync(inteliFactoryPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    "intelifactory.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

//compile contracts therein with solidity compiler
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "intelifactory.sol"
];

//write output to the 'build' directory
fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
