const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },

  prompt: { type: String },                 // what user asked
  aiModel: { type: String },                // llama3.2
  testCases: { type: Array },               // structured output
  status: { type: String, default: 'SUCCESS' }

}, { timestamps: true });

module.exports = mongoose.model('TestCase', testCaseSchema);
