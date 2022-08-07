const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const studentController = require("../controllers/Student");
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
router.get(
  "/:ra",
  studentAuth.unsureAuthenticated,
  studentController.studentExists
);


//Remover estudante
router.delete(
  "/:ra",
  studentAuth.unsureAuthenticated,
  studentController.deleteStudent
);

//Exporta o ROUTER
module.exports = router;
