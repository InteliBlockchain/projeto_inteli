const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const { StudentInstance: studentController } = require("../services/Student");
const studentAuth = require("../Middlewares/unsureAuthenticated");

//ROTAS com seus respectivos controllers e middlewares

//Criar Wallet para Estudante
router.post(
  "/create",
  [body("ra", "RA é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  studentController.createStudent
);

//Ver endereço da Wallet de um estudante
router.post(
  "/wallet",
  [body("ra", "RA é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  studentController.getWallet
);

//Ver RA de um estudante
router.post(
  "/ra",
  [body("wallet", "Wallet address é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  studentController.getStudent
);

//Remover estudante
router.delete(
  "/:ra",
  studentAuth.unsureAuthenticated,
  studentController.removeStudent
);

//Registrar entrada no Campus
router.post(
  "/checkIn",
  [body("ra", "RA é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  studentController.checkIn
);

//Registrar saída do Campus
router.post(
  "/checkOut",
  [body("ra", "RA é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  studentController.checkOut
);

//Ver entradas de um estudante específico no campus em um dia
router.post(
  "/accesses",
  [body("ra", "RA é necessário").exists({ checkFalsy: true })],
  [body("date", "Data é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  studentController.accesses
);

//Ver saídas de um estudante específico no campus em um dia
router.post(
  "/exits",
  [body("ra", "RA é necessário").exists({ checkFalsy: true })],
  [body("date", "Data é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  studentController.exits
);

//Ver todos os estudantes que entraram no campus em um dia
router.get(
  "/allAccesses/:date",
  studentAuth.unsureAuthenticated,
  studentController.AllAccesses
);

//Ver todos os estudantes que saíram do campus em um dia
router.get(
  "/allExits/:date",
  studentAuth.unsureAuthenticated,
  studentController.AllExits
);

//Exporta o ROUTER
module.exports = router;
