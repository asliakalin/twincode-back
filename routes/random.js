require("dotenv").config();
var express = require("express");
const router = express.Router();
const StandardSession = require("../models/StandardSession.js");


router.post("/startStandardSession/:sessionName", async (req, res) => {
    const adminSecret = req.headers.authorization;

    if (adminSecret === process.env.ADMIN_SECRET) {
    
        const session = await StandardSession.findOne({
            name: req.params.sessionName,
            environment: process.env.NODE_ENV,
        });

        session.running = true;
        session.save(); //Saves it on database

        res.send({ msg: "Standard Session started" });
    } else {
        res.sendStatus(401);
    }
});


router.get("/StandardSession/:sessionName", async (req, res) => {
    try {
        const session = await StandardSession.findOne({
            name: req.params.sessionName,
            environment: process.env.NODE_ENV,
        });
        res.status(200).send({status: 200, message: "Standard Session found"})
    } catch (error) {
        console.log(error);
    }
});

router.post("/newtStandardSession", async (req, res) => {
    const session = await StandardSession.create({
        name: "New Standard Session Test",
        environment: process.env.NODE_ENV,
        active: false,
        tokens: ["token"],
        running: false,
        registrationText: "thanks for participating",
        finishMessage: "THE END",
        exerciseCounter: 0,
        blindParticipant: true,
        exercises: [],
        breaks: [],
        partsTimes: [600, 300, 600]
    });

    session.save();
    res.status(200).send({status: 200, message: "Standard Session created"})
});
  
module.exports = router;