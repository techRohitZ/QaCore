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
    const suites = await TestCase.find({ project: projectId })
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

// const TestCase = require('./testcase.model');

// exports.listByProject = async (req, res) => {
//   try {
//     const projectId = req.query.projectId;
//     // We use the safe ID from your middleware
//     const userId = req.user.id; 

//     // --- DEBUG LOGS (Check your VS Code Terminal) ---
//     console.log("------------------------------------------------");
//     console.log("🔍 DEBUG: Fetching Test Cases...");
//     console.log("👉 SEARCHING FOR Project ID:", projectId);
//     console.log("👉 SEARCHING FOR User ID:   ", userId);

//     if (!projectId) {
//       return res.status(400).json({ error: "Project ID is required" });
//     }

//     // STEP 1: Try the exact search
//     const exactMatch = await TestCase.find({
//       project: projectId,
//       user: userId
//     }).sort('-createdAt');

//     // If we found data, return it immediately (Success!)
//     if (exactMatch.length > 0) {
//         console.log(`✅ SUCCESS: Found ${exactMatch.length} records.`);
//         return res.json(exactMatch);
//     }

//     // STEP 2: IF EMPTY, RUN DIAGNOSTICS (This reveals the bug)
//     console.log("⚠️ WARNING: No exact match found. Running diagnostics...");
    
//     // Fetch EVERYTHING in the collection (limited to 5 to be safe)
//     const allDocs = await TestCase.find({}).limit(5);

//     console.log("📊 DB SNAPSHOT (First 5 records):");
//     console.log(JSON.stringify(allDocs, null, 2));

//     // Return a helpful debug report to Postman
//     return res.status(200).json({
//         message: "No test cases found for your specific Project+User.",
//         debug_info: {
//             you_searched_for_project: projectId,
//             you_searched_for_user: userId,
            
//             // This shows what is ACTUALLY in your database
//             actual_database_content: allDocs.map(doc => ({
//                 _id: doc._id,
//                 project: doc.project, // <--- COMPARE THIS WITH YOUR SEARCH
//                 user: doc.user,       // <--- COMPARE THIS WITH YOUR SEARCH
//                 createdAt: doc.createdAt
//             }))
//         },
//         hint: "Compare 'you_searched_for' vs 'actual_database_content' in this JSON. Do the IDs match exactly?"
//     });

//   } catch (err) {
//     console.error("❌ CRITICAL ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// };