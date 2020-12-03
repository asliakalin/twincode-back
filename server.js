require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var cors = require("cors");
const Logger = require("./logger.js");
const Session = require("./models/Session.js");
const User = require("./models/User.js");

var app = express();

var io = null;
var consumer = null;

app.use(cors());
app.options("*", cors());

app.use(bodyParser.json());
app.use(cookieParser());

const fileDirectory = __dirname + "/assets/";

const auth = require("./routes/auth");
const tests = require("./routes/tests.js");
const admin = require("./routes/admin");
app.use(auth);
app.use(tests);
app.use(admin);

app.get("/", (req, res) => {
  res.redirect(process.env.FRONTEND_URL);
});

app.post("/registerUser", async (req, res) => {
  try {
    const user = await User.findOne({
      code: req.body.code,
      environment: process.env.NODE_ENV,
    });
    const session = await Session.findOne({
      name: user.subject,
      environment: process.env.NODE_ENV,
    });

    if (session && session.tokens.indexOf(req.body.tokenId) > -1) {
      user.token = req.body.tokenId;
      await user.save();
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/joinSession", async (req, res) => {
  User.findOne({
    code: req.query.code,
    environment: process.env.NODE_ENV,
  })
    .then((user) => {
      if (user) {
        Session.findOne({
          name: user.subject,
          environment: process.env.NODE_ENV,
        })
          .then((session) => {
            if (session) {
              if (session.active) {
                res.send({ code: req.query.code });
              } else {
                res.send(
                  "Session is not active yet. If you think it is an error, contact with your coordinator."
                );
              }
            } else {
              res.sendStatus(401);
            }
          })
          .catch((err) => {
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

app.get("/rooms/:mode/:rid/", (req, res) => {
  res.sendFile(
    "main.html",
    {
      root: fileDirectory,
    },
    (err) => {
      res.end();
      if (err) throw err;
    }
  );
});

app.get("/finishMessage", async (req, res) => {
  try {
    const user = await User.findOne({
      code: req.query.code,
      environment: process.env.NODE_ENV,
    });
    const session = await Session.findOne({
      name: user.subject,
      environment: process.env.NODE_ENV,
    });
    if (session) {
      res.send({ finishMessage: session.finishMessage });
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

app.get("/s.io/info", async (req, res) => {
  try {
    if(io && consumer){

      var clients = io.sockets.clients();

      var clientsJSON = JSON.stringify(clients,null,2);
  
      res.send("<html><body><pre>"+clientsJSON+"</pre></body></html>");
  

    }else{
      res.status(404).send("io: "+io+", consumer: "+consumer);

    }

  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = app;
