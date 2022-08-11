/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.8.15",
      }
    ],
  },
  paths: {
    sources: "./ethereum/contracts",
    artifacts: "./ethereum/artifacts",
    cache: "./ethereum/artifacts/cache"
  }
};
