const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    space: { type: String, required: true }, 
    content: { type: String, required: true }, 
    answer: [String] ,
    up: [String], 
    time: { type: Date, required: true },
    creatorId: { type: String, required: true }, 
    creatorName: { type: String, required: true }
});

const questionModel = new mongoose.model("question", questionSchema);

module.exports = questionModel;

