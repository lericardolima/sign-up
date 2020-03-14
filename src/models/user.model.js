const mongoose = require('../config/db.config');

const PhoneNumberSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_numbers: [PhoneNumberSchema],
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  logged_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
