var mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name: { type: String },
    date: { type: Date },
    category: { type: String },
    complete: { type: Boolean }
})

module.exports = mongoose.model('Task', taskSchema);
