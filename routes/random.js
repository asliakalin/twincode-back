require("dotenv").config();
var express = require("express");
const router = express.Router();
const consumer = require("../consumer.js");
const StandardSession = require("../models/StandardSession.js");


router.post("/testSS/:sessionName", async (req, res) => {
    consumer.startStandardSession(req.params.sessionName, req.app._io);
    res.send({status: 200});
});

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
        name: req.body.name,
        environment: process.env.NODE_ENV,
        active: req.body.active,
        tokens: req.body.tokens,
        running: req.body.running,
        registrationText: req.body.registrationText,
        finishMessage: req.body.finishMessage,
        exerciseCounter: req.body.exerciseCounter,
        blindParticipant: req.body.blindParticipant,
        exercises: req.body.exercises,
        breaks: req.body.breaks,
        partsTimes: req.body.partsTimes
    });

    session.save();
    res.status(200).send({status: 200, message: "Standard Session created"})
});
  
module.exports = router;