const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const accessController = require("../controllers/AccessControl");
const studentAuth = require("../Middlewares/unsureAuthenticated");

//ROTAS com seus respectivos controllers e middlewares

//Criar Wallet para Estudante
router.post(
  "/checkIn",
  [body("ra", "RA é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  accessController.CheckIn
);

//Ver endereço da Wallet de um estudante
router.post(
  "/checkOut",
  [body("ra", "RA é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  accessController.CheckOut
);


//Remover estudante
router.post(
    "/accesses",
    [body("ra", "RA é necessário").exists({ checkFalsy: true })],
    [body("date", "Data é necessário").exists({ checkFalsy: true })],
    studentAuth.unsureAuthenticated,
    accessController.Accesses
);

router.post(
    "/exits",
    [body("ra", "RA é necessário").exists({ checkFalsy: true })],
    [body("date", "Data é necessário").exists({ checkFalsy: true })],
    studentAuth.unsureAuthenticated,
    accessController.Exits
);

router.get(
    "/allAccesses/:date",
    studentAuth.unsureAuthenticated,
    accessController.AllAccesses
);

router.get(
    "/allExits/:date",
    studentAuth.unsureAuthenticated,
    accessController.AllExits
);

//Exporta o ROUTER
module.exports = router;
