const TestCase = require('../testcases/testcase.model');
const TestRun = require('./testrun.model');
const Project = require('../project/project.model'); // Adjusted path to match your structure
// ✅ This connects to your existing runner logic
const { executeRun } = require('../runner/playwrightRunner');

/**
 * 1. EXECUTE SUITE (Called by "Run Suite" button)
 * POST /api/projects/:id/run
 */
exports.executeSuite = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // 1. Validate Project
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        console.log(`🚀 Starting Suite Execution for Project: ${project.name}`);

        // 2. Create the TestRun Document
        // We set 'type' to SUITE so the runner knows to look at project.tests instead of a single testCase
        const newRun = await TestRun.create({
            user: userId,
            project: project._id,
            status: 'PENDING',
            type: 'SUITE',
            results: [],
            totalCount: project.tests ? project.tests.length : 0
        });

        // 3. Trigger Your Existing Runner
        // The runner should look up this runId, see it's a project run, and execute all tests
        executeRun(newRun._id);

        // 4. Return immediately
        res.status(201).json({
            success: true,
            message: "Test suite execution started",
            runId: newRun._id
        });

    } catch (err) {
        console.error("Execute Suite Error:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * 2. RERUN SINGLE TEST CASE (Your existing logic)
 */
exports.rerun = async (req, res) => {
    try {
        const userId = req.user.id;
        const testCase = await TestCase.findOne({
            _id: req.params.id,
            user: userId
        });

        if (!testCase) {
            return res.status(404).json({ error: 'Test case not found or not owned by user' });
        }

        const run = await TestRun.create({
            user: userId,
            project: testCase.project,
            testCaseRef: testCase._id,
            status: 'PENDING'
        });

        executeRun(run._id);

        return res.status(201).json({
            message: "Test run started",
            runId: run._id,
            status: run.status
        });

    } catch (err) {
        console.error('RERUN ERROR:', err);
        return res.status(500).json({ error: 'Failed to create test run' });
    }
};

/**
 * 3. GET SINGLE RUN DETAILS
 */
exports.getRunById = async (req, res) => {
    try {
        const run = await TestRun.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate('project testCaseRef');

        if (!run) {
            return res.status(404).json({ error: 'Test run not found' });
        }

        res.json({
            id: run._id,
            status: run.status,
            results: run.results || null,
            createdAt: run.createdAt,
            executedAt: run.executedAt
        });
    } catch (err) {
        console.error('GET RUN ERROR:', err);
        res.status(500).json({ error: 'Failed to fetch test run' });
    }
};

/**
 * 4. RERUN FAILED TESTS (Your existing logic)
 */
exports.rerunFailedTests = async (req, res) => {
    try {
        const userId = req.user.id;
        const runId = req.params.id;

        const originalRun = await TestRun.findOne({
            _id: runId,
            user: userId,
            status: 'FAILED'
        });

        if (!originalRun) {
            return res.status(404).json({ error: 'Failed run not found' });
        }

        const rawOutput = originalRun.results?.rawOutput || '';
        const failedTitles = extractFailedTestTitles(rawOutput);

        if (failedTitles.length === 0) {
            return res.status(400).json({ error: 'No failed tests detected for rerun' });
        }

        const rerun = await TestRun.create({
            user: userId,
            project: originalRun.project,
            testCaseRef: originalRun.testCaseRef,
            status: 'PENDING',
            parentRun: originalRun._id,
            rerunReason: 'FAILED_ONLY'
        });

        executeRun(rerun._id, { grep: failedTitles });

        return res.status(202).json({
            message: 'Failed tests rerun started',
            runId: rerun._id,
            failedTests: failedTitles
        });

    } catch (err) {
        console.error('RERUN FAILED ERROR:', err);
        return res.status(500).json({ error: 'Failed to rerun failed tests' });
    }
};

/**
 * 5. GET PROJECT HISTORY (Consolidated)
 * GET /api/projects/:id/runs
 */
exports.getRunsByProject = async (req, res) => {
    try {
        const userId = req.user.id;
        // Check both params in case route uses :id or :projectId
        const projectId = req.params.id || req.params.projectId;

        const { status, limit = 10, page = 1 } = req.query;

        const query = {
            user: userId,
            project: projectId
        };

        if (status) {
            query.status = status.toUpperCase();
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [runs, total] = await Promise.all([
            TestRun.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .select('-__v') // Exclude version key
                .lean(),
            TestRun.countDocuments(query)
        ]);

        res.json({
            data: runs, // Frontend expects 'data' array
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        console.error('GET RUNS BY PROJECT ERROR:', err);
        res.status(500).json({ error: 'Failed to fetch test runs' });
    }
};

// --- Helpers ---

function extractFailedTestTitles(rawOutput) {
    const titles = [];
    const regex = /›\s(.+?)\s─/g;
    let match;
    while ((match = regex.exec(rawOutput)) !== null) {
        titles.push(match[1].trim());
    }
    return [...new Set(titles)];
}

// const TestCase = require('../testcases/testcase.model');
// const TestRun = require('./testrun.model');
// const Project = require('../project/project.model');
// // ✅ CRITICAL: This path must match the folder structure above
// const { executeRun } = require('../runner/playwrightRunner');

// exports.rerun = async (req, res) => {
//   try {
//     const userId = req.user.id; // ✅ Canonical identity

//     // 1. Validate ownership
//     const testCase = await TestCase.findOne({
//       _id: req.params.id,
//       user: userId
//     });

//     if (!testCase) {
//       return res.status(404).json({
//         error: 'Test case not found or not owned by user'
//       });
//     }

//     // 2. Create Pending Run
//     const run = await TestRun.create({
//       user: userId,
//       project: testCase.project,
//       testCaseRef: testCase._id,
//       status: 'PENDING'
//     });

//     // 3. Trigger Playwright (Fire & Forget)
//     executeRun(run._id);

//     return res.status(201).json({
//       message: "Test run started",
//       runId: run._id,
//       status: run.status
//     });

//   } catch (err) {
//     console.error('RERUN ERROR:', err);
//     return res.status(500).json({ error: 'Failed to create test run' });
//   }
// };

// exports.getRunById = async (req, res) => {
//   try {
//     const run = await TestRun.findOne({
//       _id: req.params.id,
//       user: req.user.id
//     }).populate('project testCaseRef');

//     if (!run) {
//       return res.status(404).json({ error: 'Test run not found' });
//     }

//     res.json({
//       id: run._id,
//       status: run.status,
//       results: run.results || null,
//       createdAt: run.createdAt,
//       executedAt: run.executedAt
//     });
//   } catch (err) {
//     console.error('GET RUN ERROR:', err);
//     res.status(500).json({ error: 'Failed to fetch test run' });
//   }
// };
// exports.rerunFailedTests = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const runId = req.params.id;

//     // 1. Load original FAILED run
//     const originalRun = await TestRun.findOne({
//       _id: runId,
//       user: userId,
//       status: 'FAILED'
//     });

//     if (!originalRun) {
//       return res.status(404).json({
//         error: 'Failed run not found or not owned by user'
//       });
//     }

//     const rawOutput = originalRun.results?.rawOutput || '';

//     // 2. Extract failed test titles from Playwright output
//     const failedTitles = extractFailedTestTitles(rawOutput);

//     if (failedTitles.length === 0) {
//       return res.status(400).json({
//         error: 'No failed tests detected for rerun'
//       });
//     }

//     // 3. Create rerun record (linked)
//     const rerun = await TestRun.create({
//       user: userId,
//       project: originalRun.project,
//       testCaseRef: originalRun.testCaseRef,
//       status: 'PENDING',
//       parentRun: originalRun._id,
//       rerunReason: 'FAILED_ONLY'
//     });

//     // 4. Execute Playwright with grep
//     executeRun(rerun._id, {
//       grep: failedTitles
//     });

//     return res.status(202).json({
//       message: 'Failed tests rerun started',
//       runId: rerun._id,
//       failedTests: failedTitles
//     });

//   } catch (err) {
//     console.error('RERUN FAILED ERROR:', err);
//     return res.status(500).json({
//       error: 'Failed to rerun failed tests'
//     });
//   }
// };
// function extractFailedTestTitles(rawOutput) {
//   const titles = [];
//   const regex = /›\s(.+?)\s─/g;

//   let match;
//   while ((match = regex.exec(rawOutput)) !== null) {
//     titles.push(match[1].trim());
//   }

//   return [...new Set(titles)];
// }

// exports.getRunsByProject = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { projectId } = req.params;

//     const {
//       status,
//       from,
//       to,
//       page = 1,
//       limit = 10
//     } = req.query;

//     const query = {
//       user: userId,
//       project: projectId
//     };

//     if (status) {
//       query.status = status;
//     }

//     if (from || to) {
//       query.createdAt = {};
//       if (from) query.createdAt.$gte = new Date(from);
//       if (to) query.createdAt.$lte = new Date(to);
//     }

//     const skip = (Number(page) - 1) * Number(limit);

//     const [runs, total] = await Promise.all([
//       TestRun.find(query, {
//         results: 0,   // exclude heavy logs
//         __v: 0
//       })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(Number(limit))
//         .lean(),

//       TestRun.countDocuments(query)
//     ]);

//     return res.json({
//       data: runs,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });

//   } catch (err) {
//     console.error('[runs][history]', err);
//     return res.status(500).json({
//       error: 'Failed to fetch test history'
//     });
//   }
// };
// exports.getRunsByProject = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const projectId = req.params.id;

//     const { status, from, to, page = 1, limit = 10 } = req.query;

//     const query = { user: userId, project: projectId };

//     if (status) query.status = status;

//     if (from || to) {
//       query.createdAt = {};
//       if (from) query.createdAt.$gte = new Date(from);
//       if (to) query.createdAt.$lte = new Date(to);
//     }

//     const skip = (page - 1) * limit;

//     const [runs, total] = await Promise.all([
//       TestRun.find(query, { results: 0, __v: 0 })
//         .sort({ createdAt: -1 })
//         .skip(Number(skip))
//         .limit(Number(limit))
//         .lean(),
//       TestRun.countDocuments(query)
//     ]);

//     res.json({
//       data: runs,
//       pagination: {
//         page: Number(page),
//         limit: Number(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });
//   } catch (err) {
//     console.error('[getRunsByProject]', err);
//     res.status(500).json({ error: 'Failed to fetch project runs' });
//   }
// };
// exports.getRunsByProject = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const projectId = req.params.projectId;

//     const {
//       status,
//       limit = 10,
//       page = 1
//     } = req.query;

//     const query = {
//       user: userId,
//       project: projectId
//     };

//     if (status) {
//       query.status = status.toUpperCase();
//     }

//     const runs = await TestRun.find(query)
//       .sort({ createdAt: -1 })
//       .limit(Number(limit))
//       .skip((Number(page) - 1) * Number(limit))
//       .select('status results.summary createdAt executedAt parentRun rerunReason')
//       .lean();

//     const total = await TestRun.countDocuments(query);

//     res.json({
//       total,
//       page: Number(page),
//       limit: Number(limit),
//       runs
//     });

//   } catch (err) {
//     console.error('GET RUNS BY PROJECT ERROR:', err);
//     res.status(500).json({ error: 'Failed to fetch test runs' });
//   }
// };

