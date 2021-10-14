require("dotenv").config();
var express = require("express");
const router = express.Router();
const StandardSession = require("../models/StandardSession.js");


router.post("/startStandardSession/:sessionName", async (req, res) => {
    const adminSecret = req.headers.authorization;
    
    if (adminSecret === process.env.ADMIN_SECRET) {
        StandardSession.findOne({
            name: req.params.sessionName,
            environment: process.env.NODE_ENV,
        }).then((session) => {
            console.log("Session found on database " + session);
        });
        res.send({ msg: "Standard Session started" });
    } else {
        res.sendStatus(401);
    }
  });
  
module.exports = router;