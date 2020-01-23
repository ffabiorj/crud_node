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

app.post("/controllerform", urlencodeParser, (req, res) => {
  try {
    sql.query("insert into user (name, age) values (?,?)", [
      req.body.name,
      req.body.age
    ]);
  } catch (error) {
    console.log("Error", error);
  }
  res.render("controllerForm", { name: req.body.name });
});

app.get("/list/:id?", (req, res) => {
  if (!req.params.id) {
    sql.query("select * from user order by id asc", (err, results) => {
      res.render("list", { data: results });
    });
  } else {
    sql.query(
      "select * from user where id=?",
      [req.params.id],
      (err, result) => {
        res.render("list", { data: result });
      }
    );
  }
});

app.get("/update/:id", (req, res) => {
  try {
    sql.query(
      "select * from user where id=?",
      [req.params.id],
      (err, result) => {
        res.render("update", {
          name: result[0].name,
          age: result[0].age,
          id: result[0].id
        });
      }
    );
  } catch (error) {
    console.log("Error", error);
  }
});

app.post("/controllerupdate", urlencodeParser, (req, res) => {
  try {
    sql.query("update user set name=?, age=? where id=?", [
      req.body.name,
      req.body.age,
      Number(req.body.id)
    ]);
  } catch (error) {
    console.log("Error", error);
  }
  res.render("controllerUpdate");
});

app.get("/delete/:id", (req, res) => {
  try {
    sql.query("delete from user where id=?", [req.params.id]);
  } catch (error) {
    console.log("Id does not existe", error);
  }
  res.render("delete");
});

//Start server
app.listen(3000, (req, res) => {
  console.log("Servidor está rondando na porta 3000!");
});
