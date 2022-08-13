const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const studentController = require("../controllers/inteli");
const studentAuth = require("../Middlewares/unsureAuthenticated");

//ROTAS com seus respectivos controllers e middlewares

router.post(
  "/rewardStudent",
  [body("quantity", "Data é necessário").exists({ checkFalsy: true })],
  [body("raStudent", "RA do estudante é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  studentController.rewardStudent
);

router.get(
  "/balance/:ra",
  studentAuth.unsureAuthenticated,
  studentController.Balance
);

//Exporta o ROUTER
module.exports = router;