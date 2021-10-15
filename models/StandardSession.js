const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  environment: { type: String },
  name: { type: String, required: true },
  active: { type: Boolean, default: false },
  tokens: { type: Array, required: true },
  running: { type: Boolean, default: false },
  registrationText: { type: String },
  finishMessage: { type: String },
  exerciseCounter: { type: Number, default: -1 },
  blindParticipant: { type: Boolean, default: true },
  exercises: { type: Array, required: true },
  breaks: { type: Array, required: true },
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
