const { validationResult } = require("express-validator");
const studentService = require("../services/Student");
require("express-async-errors");

const studentExists = (req, res) => {
  //Pega as infos da requisição
  const { ra } = req.body;

  //Valida se algum paremetro é inválido
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      error: errors.errors[0].msg,
    });
    return;
  } else {
    //Instancia a classe criando uma vaga
    const Student = new studentService.Student();

    //Tratamento das respostas do método da classe
    Student.getStudent(ra).then((resul) => {
      if (resul.type === "error") {
        res.status(500).json({
          error: resul.message,
        });
      } else {
        res.status(200).json({
          message: resul.message,
        });
      }
    });

    return user;
  }
};

const createStudent = (req, res) => {
  //Pega as infos da requisição
  const { ra } = req.body;

  //Valida se algum paremetro é inválido
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      error: errors.errors[0].msg,
    });
    return;
  } else {
    //Instancia a classe criando uma vaga
    const Student = new studentService.Student();

    //Tratamento das respostas do método da classe
    Student.createStudent(ra).then((resul) => {
      if (resul.type === "error") {
        res.status(500).json({
          error: resul.message,
        });
      } else {
        res.status(200).json({
          message: resul.message,
        });
      }
    });

    return user;
  }
};

//Exporta as funções do controller para o ROUTER
module.exports = {
  studentExists,
  createStudent,
};
