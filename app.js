const express = require("express");
require("express-async-errors");
require("dotenv").config();
var bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());

/* Só a necessidade de ativar está parte do código quando ele estiver em produção
app.use(cors({
    origin: 'URL DO INTELI'
}));
*/

app.use(express.json()); //Irá suportar JSON
app.use(
  bodyParser.urlencoded({
    // Irá suportar urlenconded
    extended: true,
  })
);

const PORT = process.env.PORT || 3001;

const StudentRouter = require("./routes/student");
app.use("/student", StudentRouter);

const lectureRouter = require("./routes/lecture");
app.use("/lecture", lectureRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
