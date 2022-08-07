//npm module
import web3 from "./web3";
//compiled smart contract
import accessCampus from "./build/AccessCampus.json";

//pass address of the 'factory' to web3
//TODO: declare address as ENV variable
const instance = new web3.eth.Contract(
  inteliFactory.abi,
  "0xD1Ec1c600eD19fe4E5B32b5fD22f8228Af461912"
);

export default instance;
