var mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: { type: String },
    date: { type: Date },
    allDay: {type: Boolean},
    startTime: {type: String},
    endTime: {type: String},
    category: {type: String}
})

module.exports = mongoose.model('Event', eventSchema);
