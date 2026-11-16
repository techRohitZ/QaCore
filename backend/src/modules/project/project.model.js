const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // ✅ ADD THIS SECTION SO MONGOOSE KNOWS TO SAVE TESTS
    tests: [{
        title: { type: String },
        targetUrl: String,
        expectedResult: String,
        priority: String,
        code: { type: String },
        status: { type: String, default: 'draft' }, // draft, passed, failed
        createdAt: { type: Date, default: Date.now }
    }]

}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
