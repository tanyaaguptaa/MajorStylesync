const mongoose = require('mongoose');

const EmailConfigSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  }
});


module.exports = mongoose.model('EmailConfig', EmailConfigSchema);
