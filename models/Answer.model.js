const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    qid: { type: String, required: true }, 
    content: { type: String, required: true }, 
    uname: { type: String, required: true },
    uid: { type: String, required: true },
    timestamp: { type: Date, required: true }
});

const answerModel = new mongoose.model("answer", answerSchema);

module.exports = answerModel;

