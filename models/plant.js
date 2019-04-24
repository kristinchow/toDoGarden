var mongoose = require('mongoose')

const plantSchema = new mongoose.Schema({
    name: { type: String },
    date: { type: Date },
    type: { type: String },
    points: {type: Number }
})

module.exports = mongoose.model('Plant', plantSchema);
