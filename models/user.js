var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event'}]

})

module.exports = mongoose.model('User', userSchema);
