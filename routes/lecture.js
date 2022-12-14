const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const lectureController = require("../controllers/lecture");
const studentAuth = require("../middlewares/unsureAuthenticated");

const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
//ROTAS com seus respectivos controllers e middlewares

//Criar registro de palestra e todos os alunos que participaram
router.post(
  "/create",
  // [body("lectureName", "Nome da palestra é necessário").exists({ checkFalsy: true })],
  // [body("ras", "RA's é necessário").exists({ checkFalsy: true })],
  studentAuth.unsureAuthenticated,
  upload.single('file'),
  lectureController.createLecture
);

//Ver todas as palestras que um aluno participou
router.get(
  "/student/:ra",
  studentAuth.unsureAuthenticated,
  lectureController.getLecturesStudent
);

//Ver todas as palestras que aconteceram no Inteli
router.get(
  "/",
  studentAuth.unsureAuthenticated,
  lectureController.getLectures
);

//Queimar uma NFT de palestras
router.post(
    "/burnNFT",
    [body("nft", "NFT é necessário").exists({ checkFalsy: true })],
    studentAuth.unsureAuthenticated,
    lectureController.burnNFT
);

//Verificar todos os RAS que participaram de uma palestra
router.get(
    "/getRas/:lecture",
    studentAuth.unsureAuthenticated,
    lectureController.getLectureRas
);

//Atualizar o URI
router.put(
    "/changeURI",
    [body("nsei", "Nsei é necessário").exists({ checkFalsy: true })],
    studentAuth.unsureAuthenticated,
    lectureController.changeURI
);

//Exporta o ROUTER
module.exports = router;
