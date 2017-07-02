const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }], 
});

module.exports = mongoose.model('List', schema);