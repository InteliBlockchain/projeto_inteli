const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const inteliController = require("../controllers/inteli");
const studentAuth = require("../middlewares/unsureAuthenticated");

//ROTAS com seus respectivos controllers e middlewares

router.post(
  "/rewardStudent",
  [body("quantity", "quantity é necessário").exists({ checkFalsy: true })],
  [body("raStudent", "raStudent é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  inteliController.rewardStudent
);

router.get(
  "/balance",
  studentAuth.unsureAuthenticated,
  inteliController.balance
);

//Exporta o ROUTER
module.exports = router;