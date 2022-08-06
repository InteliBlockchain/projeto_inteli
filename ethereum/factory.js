//npm module
import web3 from "./web3";
//compiled smart contract
import inteliFactory from "./build/InteliFactory.json";

//pass address of the 'factory' to web3
//TODO: declare address as ENV variable
const instance = new web3.eth.Contract(
  Factory.abi,
  "0x027400c1139615ccDb21F1db45435c7cfcb0377A"
);

export default instance;
