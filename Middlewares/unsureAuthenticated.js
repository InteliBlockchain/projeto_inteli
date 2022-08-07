const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const unsureAuthenticated = (req, res, next) => {
  //Recebe o token inserido pela aplicação
  const authToken = req.headers.authorization;

  //Valida se o token está preenchido
  if (!authToken) {
    res.status(401).json({
      message: "You need a token to access this action",
    });
    return;
  }

  //Desestrutura o header "Bearer 'token'"
  [, token] = authToken.split(" ");

  //Valida se o token é válido
  if (token === process.env.JWT_USER_SECRET) {
    return next();
  } else {
    //Retorna o erro caso o token não seja válido
    res.status(401).json({
      message: "Token is not valid",
    });
    return;
  }
};

//Exporta como um MIDDLEWARE
module.exports = {
  unsureAuthenticated,
};
