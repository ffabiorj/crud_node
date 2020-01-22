const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const handlebars = require("express-handlebars");
const app = express();
const urlencodeParser = bodyParser.urlencoded({ extended: false });
const sql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: 3306
});
sql.query("use crude");

// Template engine
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use("/css", express.static("css"));
app.use("/js", express.static("js"));

// Routes and Templates
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/insert", (req, res) => {
  res.render("insert");
});

app.post("/controllerForm", urlencodeParser, (req, res) => {
    sql.query('insert into user (name, age) values (?,?)', [req.body.name, req.body.age])
    console.log(req.body.name, req.body.age);
    res.render('controllerForm', {name:req.body.name});
});

//Start server
app.listen(3000, (req, res) => {
  console.log("Servidor está rondando na porta 3000!");
});
