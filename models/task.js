var mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name: { type: String },
    date: { type: Date },
    category: { type: String },
    complete: { type: Boolean },
    points: {type: Number }
})

module.exports = mongoose.model('Task', taskSchema);
