//core module
const path = require("path");
//npm modules
const solc = require("solc");
const fs = require("fs-extra");

//delete entire 'build' folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

//read 'contract.sol' from the 'contracts' folder
const contractPath = path.resolve(__dirname, "contracts", "contract.sol");
const source = fs.readFileSync(contractPath, "utf-8");

const input = {
  language: "Solidity",
  sources: {
    "contract.sol": {
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
  "contract.sol"
];

//write output to the 'build' directory
fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
