const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const inteliController = require("../controllers/inteli");
const studentAuth = require("../middlewares/unsureAuthenticated");

//ROTAS com seus respectivos controllers e middlewares

router.post(
  "/rewardStudent",
  [body("quantity", "Data é necessário").exists({ checkFalsy: true })],
  [body("raStudent", "RA do estudante é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  inteliController.rewardStudent
);

router.get(
  "/balance/:ra",
  studentAuth.unsureAuthenticated,
  inteliController.balance
);

//Exporta o ROUTER
module.exports = router;