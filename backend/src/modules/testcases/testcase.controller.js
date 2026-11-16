const TestCase = require('./testcase.model');

/**
 * @desc    Get Grouped Test Suites (The "Folder" View)
 * @route   GET /api/testcases/project/:projectId
 * @access  Private
 * @note    This is the main function used by your new ProjectDetails UI
 */
exports.getProjectSuites = async (req, res) => {
  try {
    const projectId = req.params.projectId || req.query.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required." });
    }

    // Fetch Test Cases grouped by creation time (Newest First)
    const suites = await TestCase.find({ project: projectId, user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v'); // Optimize by removing version key

    console.log(`✅ Fetched ${suites.length} suites for project ${projectId}`);

    res.status(200).json(suites);

  } catch (err) {
    console.error("❌ Error fetching project suites:", err.message);
    res.status(500).json({
      message: "Failed to retrieve test history.",
      error: err.message
    });
  }
};

/**
 * @desc    List All Test Cases (Flat List / Debugging)
 * @route   GET /api/testcases/list
 * @access  Private
 */
exports.listByProject = async (req, res) => {
  try {
    const projectId = req.query.projectId;
    const userId = req.user.id;

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const testCases = await TestCase.find({
      project: projectId,
      user: userId
    }).sort('-createdAt');

    res.status(200).json(testCases);

  } catch (err) {
    console.error("❌ List Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc    Delete a Test Suite
 * @route   DELETE /api/testcases/:id
 * @access  Private
 */
exports.deleteTestCase = async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);

    if (!testCase) {
      return res.status(404).json({ message: "Test suite not found" });
    }

    // Ensure the user owns this test case
    if (testCase.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete this suite" });
    }

    await testCase.deleteOne();
    res.status(200).json({ message: "Test suite deleted successfully" });

  } catch (err) {
    console.error("❌ Delete Error:", err.message);
    res.status(500).json({ message: "Failed to delete test suite" });
  }
};
