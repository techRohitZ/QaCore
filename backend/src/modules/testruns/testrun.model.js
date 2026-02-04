const mongoose = require('mongoose');

const testRunSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  
  // ✅ FIX 1: Made optional. 'required: true' was removed.
  // This allows "Suite" runs (which affect the whole project) to exist without a specific test case ID.
  testCaseRef: { type: mongoose.Schema.Types.ObjectId, ref: 'TestCase' },

  // ✅ FIX 2: Added 'type' to match your controller logic (type: 'SUITE')
  type: {
    type: String,
    enum: ['SINGLE', 'SUITE'],
    default: 'SINGLE'
  },

  status: {
    type: String,
    enum: ['PENDING', 'RUNNING', 'PASSED', 'FAILED'],
    default: 'PENDING'
  },

  // ✅ FIX 3: Changed to Array to match Frontend/Controller expectations
  // Your frontend tries to .map() over this, so it MUST be an array of objects.
  results: [
    {
      testTitle: String,
      status: { type: String, enum: ['pass', 'fail'] },
      duration: Number,
      error: String
    }
  ],

  // Optional: Store suite-level stats here for quick dashboard access
  stats: {
    durationMs: Number,
    passCount: { type: Number, default: 0 },
    failCount: { type: Number, default: 0 },
    totalTests: { type: Number, default: 0 }
  },

  // Store raw console logs/output separately from the structured results
  rawOutput: {
    type: String
  },

  parentRun: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TestRun',
    default: null
  },
  
  rerunReason: {
    type: String,
    enum: ['FAILED_ONLY'],
    default: null
  },

  executedAt: {
    type: Date
  }
    
}, { timestamps: true });

// 🔍 Indexes for history & dashboard queries
testRunSchema.index({ user: 1, project: 1, createdAt: -1 });
testRunSchema.index({ status: 1 });
testRunSchema.index({ parentRun: 1 });

module.exports = mongoose.model('TestRun', testRunSchema);