var mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name: { type: String },
    date: { type: Date },
    complete: { type: Boolean },
    points: {type: Number },
    plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant'}
})

module.exports = mongoose.model('Task', taskSchema);
