const { validationResult } = require("express-validator");
const studentService = require("../services/Student");
require("express-async-errors");

const CheckIn = (req, res) => {
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
    const Access = new accessService.Student();

    //Tratamento das respostas do método da classe
    Access.checkIn(ra).then((resul) => {
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

    return Access;
  }
};

const CheckOut = (req, res) => {
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
      const Access = new accessService.Student();
  
      //Tratamento das respostas do método da classe
      Access.checkOut(ra).then((resul) => {
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
  
      return Access;
    }
};

const Accesses = (req, res) => {
    //Pega as infos da requisição
    const { ra, date } = req.body;
  
    //Valida se algum paremetro é inválido
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: errors.errors[0].msg,
      });
      return;
    } else {
      //Instancia a classe criando uma vaga
      const Access = new accessService.Student();
  
      //Tratamento das respostas do método da classe
      Access.accesses(ra, date).then((resul) => {
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
  
      return Access;
    }
};

const Exits = (req, res) => {
    //Pega as infos da requisição
    const { ra, date } = req.body;
  
    //Valida se algum paremetro é inválido
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: errors.errors[0].msg,
      });
      return;
    } else {
      //Instancia a classe criando uma vaga
      const Access = new accessService.Student();
  
      //Tratamento das respostas do método da classe
      Access.accesses(ra, date).then((resul) => {
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
  
      return Access;
    }
};

const AllAccesses = (req, res) => {
    //Pega as infos da requisição
    const { date } = req.params;
  
    //Instancia a classe criando uma vaga
    const Access = new accessService.Student();

    //Tratamento das respostas do método da classe
    Access.allAccesses(date).then((resul) => {
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

    return Access;
};

const AllExits = (req, res) => {
    //Pega as infos da requisição
    const { date } = req.params;
  
    //Instancia a classe criando uma vaga
    const Access = new accessService.Student();

    //Tratamento das respostas do método da classe
    Access.allExits(date).then((resul) => {
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

    return Access;
};

//Exporta as funções do controller para o ROUTER
module.exports = {
  CheckIn,
  CheckOut,
  Accesses,
  Exits
};
