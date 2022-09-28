const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const AccessCampusERC20Controller = require("../controllers/AccessCampusERC20");
const studentAuth = require("../middlewares/unsureAuthenticated");

//ROTAS com seus respectivos controllers e middlewares

router.post(
    "/GivePresence",
    [body("ra", "RA é necessário").exists({ checkFalsy: true })],
    studentAuth.unsureAuthenticated,
    AccessCampusERC20Controller.givePresence
);

router.post(
  "/RemovePresence",
  [body("ra", "RA é necessário").exists({ checkFalsy: true })],
  [body("qnt", "Quantidade é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  AccessCampusERC20Controller.removePresence
);

router.post(
  "/balance",
  [body("ra", "RA é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  AccessCampusERC20Controller.seePresences
);

//Exporta o ROUTER
module.exports = router;