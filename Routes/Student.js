const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const userController = require("../controllers/User");
const userAuth = require("../Middlewares/unsureAuthenticated");

//ROTAS com seus respectivos controllers e middlewares
router.post(
  "/studentExists",
  [body("ra", "RA é necessário").exists({ checkFalsy: true })],
  userAuth.unsureAuthenticated,
  userController.studentExists
);

//Exporta o ROUTER
module.exports = router;
