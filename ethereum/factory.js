//npm module
import web3 from "./web3";
//compiled smart contract
import Factory from "./build/Factory.json";

//pass address of the 'factory' to web3
//TODO: declare address as ENV variable
const instance = new web3.eth.Contract(
  Factory.abi,
  "" //hash da factory na blockchain
);

export default instance;
