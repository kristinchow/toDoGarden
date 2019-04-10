var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
})

module.exports = mongoose.model('User', userSchema);
//{type: mongoose.Schema.ObjectId, ref: 'Task'}