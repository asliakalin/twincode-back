const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  environment: { type: String },
  name: { type: String, required: true },
  active: { type: Boolean, default: false },
  tokens: { type: Array, required: true },
  running: { type: Boolean, default: false },
  testCounter: { type: Number, default: 0 },
  registrationText: { type: String },
  finishMessage: { type: String },
  exerciseCounter: { type: Number, default: 0 },
  blindParticipant: { type: Boolean, default: true },
  exercises: { type: Array, required: true },
  breaks: { type: Array, required: true },
  partsMessage: { type: Array, required: true, default: ["PART 1 IN PAIR", "PART 2 INDIVIDUAL", "PART 3 IN PAIR"] },
  language: { type: String, required: true, default: "javascript"},
  nextTest : { type: Boolean, required: true, default: true },
  partsTimes: { type: Array, required: true, default: [600, 300, 600] }
});

SessionSchema.index(
  {
    environment: 1,
    name: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("StandardSession", SessionSchema);
