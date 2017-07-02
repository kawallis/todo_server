const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('Task', schema);