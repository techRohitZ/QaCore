const TestCase = require('./testcase.model');

exports.listByProject = async (req, res) => {
  try {
    const projectId = req.query.projectId;
    // We use the safe ID from your middleware
    const userId = req.user.id; 

    // --- DEBUG LOGS (Check your VS Code Terminal) ---
    console.log("------------------------------------------------");
    console.log("🔍 DEBUG: Fetching Test Cases...");
    console.log("👉 SEARCHING FOR Project ID:", projectId);
    console.log("👉 SEARCHING FOR User ID:   ", userId);

    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    // STEP 1: Try the exact search
    const exactMatch = await TestCase.find({
      project: projectId,
      user: userId
    }).sort('-createdAt');

    // If we found data, return it immediately (Success!)
    if (exactMatch.length > 0) {
        console.log(`✅ SUCCESS: Found ${exactMatch.length} records.`);
        return res.json(exactMatch);
    }

    // STEP 2: IF EMPTY, RUN DIAGNOSTICS (This reveals the bug)
    console.log("⚠️ WARNING: No exact match found. Running diagnostics...");
    
    // Fetch EVERYTHING in the collection (limited to 5 to be safe)
    const allDocs = await TestCase.find({}).limit(5);

    console.log("📊 DB SNAPSHOT (First 5 records):");
    console.log(JSON.stringify(allDocs, null, 2));

    // Return a helpful debug report to Postman
    return res.status(200).json({
        message: "No test cases found for your specific Project+User.",
        debug_info: {
            you_searched_for_project: projectId,
            you_searched_for_user: userId,
            
            // This shows what is ACTUALLY in your database
            actual_database_content: allDocs.map(doc => ({
                _id: doc._id,
                project: doc.project, // <--- COMPARE THIS WITH YOUR SEARCH
                user: doc.user,       // <--- COMPARE THIS WITH YOUR SEARCH
                createdAt: doc.createdAt
            }))
        },
        hint: "Compare 'you_searched_for' vs 'actual_database_content' in this JSON. Do the IDs match exactly?"
    });

  } catch (err) {
    console.error("❌ CRITICAL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};