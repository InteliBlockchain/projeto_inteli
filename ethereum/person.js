//project module
import web3 from "./web3";
//compiled smart contract
import contract from "./build/Person.json";

//pass address of the 'contract' to web3
//TODO: declare address as ENV variable
const instance = (address) => {
  return new web3.eth.Contract(contract.abi, address);
};

export default instance;
