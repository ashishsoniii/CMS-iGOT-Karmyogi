const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  page_id: { type: String, required: true },
  file_path: { type: String, required: true },
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Page', PageSchema);
