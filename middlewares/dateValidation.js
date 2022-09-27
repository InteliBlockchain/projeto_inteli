const express = require("express");
require("dotenv").config();

const dateValidation = (req, res, next) => {
    const {dateTime, date} = req.body

    if (dateTime) {
      const formatedDateTime = new Date(req.body.dateTime)
      if(formatedDateTime == 'Invalid Date') {
        res.status(500).send("DateTime is invalid")
      } else {
        return next()
      }
    }else if (date) {
      const formatedDate = new Date(req.body.date)
      if(formatedDate == 'Invalid Date') {
        res.status(500).send("Date is invalid")
      } else {
        return next()
      }
    } else {
      res.status(500).send("Valor(es) de data(s) inválidos")
    }
};

const dateValidationParams = (req, res, next) => {
  const {date} = req.params

  if(date) {
    const formatedDate = new Date(date)
    if(formatedDate == 'Invalid Date') {
      res.status(500).send("Date is invalid")
    } else {
      return next()
    }
  } else {
    res.status(500).send("Valor de data inválidos")
  }

};

//Exporta como um MIDDLEWARE
module.exports = {
  dateValidation, dateValidationParams
};
