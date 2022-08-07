const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const { StudentInstance: studentController } = require("../services/Student");
const studentAuth = require("../Middlewares/unsureAuthenticated");

//ROTAS com seus respectivos controllers e middlewares

//Criar registro de palestra e todos os alunos que participaram
router.post(
  "/",
  [body("lectureName", "Nome da palestra é necessário").exists({ checkFalsy: true })],
  [body("ras", "RA's é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  //Passar a função do Controller
);

//Ver todas as palestras que um aluno participou
router.get(
  "/student/:ra",
  studentAuth.unsureAuthenticated,
  //Passar a função do Controller
);

//Ver todas as palestras que aconteceram no Inteli
router.get(
  "/lectures",
  studentAuth.unsureAuthenticated,
  //Passar a função do Controller
);

//Exporta o ROUTER
module.exports = router;
