const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const PROJECT_ROOT = path.join(__dirname, '../../..');
const TestRun = require('../testruns/testrun.model');
const { generateSpec } = require('./specGenerator');

/**
 * Professional Playwright Runner (Windows Safe)
 * - Fixes "0 Tests" bug by sanitizing file paths (Backslash -> Forward Slash)
 * - Deep Populates Project Tests
 * - Captures JSON results accurately
 */
async function executeRun(runId, options = {}) {
  const startTime = Date.now();

  try {
    console.log(`\n🚀 STARTING RUN: ${runId}`);

    // 1️⃣ Fetch & Deep Populate
    const run = await TestRun.findById(runId)
      .populate('project')
      .populate('testCaseRef');

    if (!run) { console.error('❌ Run not found'); return; }

    /* 2️⃣ Select Tests */
    let testCasesToRun = [];
    if (run.type === 'SUITE') {
      if (run.project && run.project.tests) testCasesToRun = run.project.tests;
    } else if (run.testCaseRef) {
      testCasesToRun = run.testCaseRef.testCases || [];
    }

    if (options.grep) testCasesToRun = testCasesToRun.filter(tc => options.grep.some(title => title.endsWith(tc.title)));
    console.log(`🔍 Discovered ${testCasesToRun.length} tests to execute.`);
    if (testCasesToRun.length === 0) throw new Error('No test cases found.');

    /* 3️⃣ Update Status */
    await TestRun.findByIdAndUpdate(runId, { status: 'RUNNING' });

    /* 4️⃣ Prepare Directory */
    const generatedDir = path.join(PROJECT_ROOT, 'tests', 'generated');
    if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });

    /* 5️⃣ Write Spec File */
    const specPath = path.join(generatedDir, `run-${runId}.spec.js`);
    // Generate content using the new "Strict Heuristic" generator
    const specContent = generateSpec(testCasesToRun, run.project.url, runId);

    fs.writeFileSync(specPath, specContent, 'utf8');
    console.log('📝 Spec File Written:', specPath);

    /* 6️⃣ Execute Playwright (WINDOWS FIX) */

    // ✅ CRITICAL FIX: Convert absolute path to relative + forward slashes
    // This prevents "C:\tests" from being interpreted as "C:[TAB]ests"
    const safeSpecPath = path.relative(PROJECT_ROOT, specPath).replace(/\\/g, '/');

    const command = [
      'npx playwright test',
      `"${safeSpecPath}"`, // Use the safe path
      '--config playwright.config.js',
      '--reporter=json',
      '--workers=1'
    ].join(' ');

    console.log(`💻 Executing: ${command}`);

    exec(command, {
        cwd: PROJECT_ROOT,
        env: { ...process.env, CI: 'true' },
        timeout: 180000,
        maxBuffer: 1024 * 1024 * 10
      },
      async (error, stdout, stderr) => {
        let finalStatus = error ? 'FAILED' : 'PASSED';
        let structuredResults = [];
        let rawOutput = stdout || stderr || '';

        try {
          if (stdout) {
            const jsonStart = stdout.indexOf('{');
            const jsonEnd = stdout.lastIndexOf('}');
            if (jsonStart !== -1) {
                const cleanJson = stdout.substring(jsonStart, jsonEnd + 1);
                const jsonResult = JSON.parse(cleanJson);

                const flattenSuites = suites => suites.flatMap(suite => [suite, ...flattenSuites(suite.suites || [])]);
                structuredResults = flattenSuites(jsonResult.suites || []).flatMap(suite =>
                  (suite.specs || []).flatMap(spec =>
                    spec.tests.flatMap(test => {
                      const result = test.results.at(-1) || { status: 'failed', duration: 0 };
                      const isPass = result.status === 'passed';
                      if (!isPass) finalStatus = 'FAILED';

                      return {
                        testTitle: spec.title,
                        status: isPass ? 'pass' : 'fail',
                        duration: result.duration,
                        error: result.error ? result.error.message : null
                      };
                    })
                  )
                );
            }
          }

          if (structuredResults.some(r => r.status === 'fail')) finalStatus = 'FAILED';

          // If execution finished but 0 results found, mark as failed
          if (structuredResults.length === 0) {
             finalStatus = 'FAILED';
             rawOutput += '\n⚠️ Error: No tests processed. Path issue resolved?';
          }

        } catch (e) {
          console.error("JSON Parse Error:", e);
          finalStatus = 'FAILED';
        }

        /* 7️⃣ Save Results */
        await TestRun.findByIdAndUpdate(runId, {
          status: finalStatus,
          stats: { durationMs: Date.now() - startTime, totalTests: structuredResults.length, passCount: structuredResults.filter(r => r.status === "pass").length, failCount: structuredResults.filter(r => r.status === "fail").length },
          results: structuredResults,
          rawOutput: rawOutput,
          executedAt: new Date()
        });

        console.log(`✅ Run Completed: ${finalStatus} (${structuredResults.length} tests)`);

        // Cleanup: Delete the generated file after run to keep folder clean
        try { fs.unlinkSync(specPath); } catch (e) {}
      }
    );

  } catch (err) {
    console.error('❌ RUNNER EXCEPTION:', err.message);
    await TestRun.findByIdAndUpdate(runId, { status: 'FAILED', rawOutput: err.message, results: [] });
  }
}

module.exports = { executeRun };
