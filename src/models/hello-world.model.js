const mongoose = require('../config/db.config');

const HelloWorldSchema = new mongoose.Schema({
  message: {
    type: String,
    default: 'Hello world!!',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HelloWorld', HelloWorldSchema);
