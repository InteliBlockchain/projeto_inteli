const { web3 } = require("../ethereum/web3");
//compiled smart contract
const { instance: inteliFactory } = require("../ethereum/factory");

const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class Student {
  async getStudent(req, res) {
    try {
      const accounts = await web3.eth.getAccounts();
      const ra = await inteliFactory.methods
        .getStudent(req.body.address)
        .call({ from: accounts[0] });
      res.send(ra);
    } catch (err) {
      res.status(400).send();
    }
  }

  async getWallet(req, res) {
    try {
      const accounts = await web3.eth.getAccounts();
      const wallet = await inteliFactory.methods
        .getWallet(req.body.ra)
        .call({ from: accounts[0] });
      res.send(wallet);
    } catch (err) {
      res.status(400).send();
    }
  }

  async createStudent(req, res) {
    try {
      const accounts = await web3.eth.getAccounts();

      await inteliFactory.methods.createStudent(req.body.ra).send({
        from: accounts[0],
      });
    } catch (err) {
      res.status(400).send();
    }
  }

  async removeStudent(req, res) {
    try {
      const accounts = await web3.eth.getAccounts();

      await inteliFactory.methods.removeStudent(req.body.ra).send({
        from: accounts[0],
      });

      res.send();
    } catch (err) {
      res.status(400).send();
    }
    // Lembrar de executar o autodestruct do contrato Person (branch do lemos)
  }

  async checkIn(ra) {}

  async checkOut(ra) {}

  async accesses(ra) {}

  async exits(ra) {}

  async AllAccesses() {}

  async AllExits() {}
}

const StudentInstance = new Student();

module.exports = {
  StudentInstance,
};
