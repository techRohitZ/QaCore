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
async function executeRun(runId) {
  const startTime = Date.now();

  try {
    console.log(`\n🚀 STARTING RUN: ${runId}`);

    // 1️⃣ Fetch & Deep Populate
    const run = await TestRun.findById(runId)
      .populate({
        path: 'project',
        populate: { path: 'tests' } 
      })
      .populate('testCaseRef');

    if (!run) { console.error('❌ Run not found'); return; }

    /* 2️⃣ Select Tests */
    let testCasesToRun = [];
    if (run.type === 'SUITE') {
      if (run.project && run.project.tests) testCasesToRun = run.project.tests;
    } else if (run.testCaseRef) {
      testCasesToRun = [run.testCaseRef];
    }

    console.log(`🔍 Discovered ${testCasesToRun.length} tests to execute.`);
    if (testCasesToRun.length === 0) throw new Error('No test cases found.');

    /* 3️⃣ Update Status */
    await TestRun.findByIdAndUpdate(runId, { status: 'RUNNING' });

    /* 4️⃣ Prepare Directory */
    const generatedDir = path.join(process.cwd(), 'tests', 'generated');
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
        maxBuffer: 1024 * 1024 * 10
      },
      async (error, stdout, stderr) => {
        let finalStatus = 'PASSED';
        let structuredResults = [];
        let rawOutput = stdout || stderr || '';

        try {
          if (stdout) {
            const jsonStart = stdout.indexOf('{');
            const jsonEnd = stdout.lastIndexOf('}');
            if (jsonStart !== -1) {
                const cleanJson = stdout.substring(jsonStart, jsonEnd + 1);
                const jsonResult = JSON.parse(cleanJson);
                
                structuredResults = jsonResult.suites.flatMap(suite => 
                  suite.specs.flatMap(spec => 
                    spec.tests.flatMap(test => {
                      const result = test.results[0];
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
// const { exec } = require('child_process');
// const fs = require('fs');
// const path = require('path');
// const PROJECT_ROOT = path.join(__dirname, '../../..');
// const TestRun = require('../testruns/testrun.model');
// const { generateSpec } = require('./specGenerator');

// /**
//  * Stable Playwright Runner
//  * - Windows safe
//  * - No spawn / ESC crash
//  * - Explicit spec execution
//  * - Deterministic DB updates
//  * - One-time flaky retry (runtime failures only)
//  */
// async function executeRun(runId) {
//   const startTime = Date.now();

//   try {
//     console.log(`\n🚀 STARTING RUN: ${runId}`);

//     const run = await TestRun.findById(runId)
//       .populate('testCaseRef')
//       .populate('project');

//     if (!run) {
//       console.error('❌ Run not found');
//       return;
//     }

//     /* 1️⃣ Mark RUNNING */
//     await TestRun.findByIdAndUpdate(runId, { status: 'RUNNING' });

//     /* 2️⃣ Ensure generated directory */
//     const generatedDir = path.join(process.cwd(), 'tests', 'generated');
//     if (!fs.existsSync(generatedDir)) {
//       fs.mkdirSync(generatedDir, { recursive: true });
//     }

//     /* 3️⃣ Clean old generated specs */
//     fs.readdirSync(generatedDir)
//       .filter(f => f.endsWith('.spec.js'))
//       .forEach(f => {
//         try {
//           fs.unlinkSync(path.join(generatedDir, f));
//         } catch (_) {}
//       });

//     /* 4️⃣ Generate spec */
//     const specPath = path.join(generatedDir, `run-${runId}.spec.js`);
//     console.log('📝 Writing spec file to:', specPath);

//     fs.writeFileSync(
//       specPath,
//       generateSpec(
//         run.testCaseRef.testCases,
//         run.project.url,
//         runId
//       ),
//       'utf8'
//     );

//     console.log(`📄 Spec Generated: ${specPath}`);

//     /* 5️⃣ Explicit Playwright execution (NO discovery ambiguity) */
//     const command = [
//   'npx playwright test',
//   '--config playwright.config.js',
//   '--reporter=line',
//   '--workers=1'
// ].join(' ');

//     console.log(`💻 Executing: ${command}`);

//     exec(command, {
//   cwd: PROJECT_ROOT,   // ✅ CRITICAL FIX
//   env: { ...process.env, CI: 'true' },
//   maxBuffer: 1024 * 1024 * 10
//       },
//       async (error, stdout, stderr) => {
//         console.log('🏁 Execution Finished');

//         const durationMs = Date.now() - startTime;
//         const combinedOutput = `${stdout}\n${stderr}`;
//         const failedTests = extractFailedTests(combinedOutput);

//         const noTestsFound =
//           combinedOutput.includes('No tests found');

//         /* 6️⃣ Correct status calculation */
//         let status = 'PASSED';
//         if (noTestsFound || error) {
//           status = 'FAILED';
//         }

//         /* 7️⃣ Deterministic DB update */
//         await TestRun.findByIdAndUpdate(runId, {
//           status,
//           results: {
//             summary: noTestsFound
//               ? 'No tests discovered by Playwright'
//               : status === 'PASSED'
//                 ? 'All tests passed successfully'
//                 : 'One or more tests failed',
//             rawOutput: combinedOutput,
//             durationMs,
//             failedTests
//           },
//           executedAt: new Date()
//         });

//         console.log(`✅ DB Updated: ${status}`);

//         /* 8️⃣ ONE-TIME flaky retry (runtime failures only) */
//         if (
//           status === 'FAILED' &&
//           !noTestsFound &&              // ❗ never retry discovery failures
//           !run.parentRun &&
//           isFlakyFailure(combinedOutput) &&
//           failedTests.length > 0
//         ) {
//           console.log('🔁 Flaky detected — retrying failed tests once');

//           const retryRun = await TestRun.create({
//             user: run.user,
//             project: run.project,
//             testCaseRef: run.testCaseRef,
//             parentRun: run._id,
//             rerunReason: 'FAILED_ONLY',
//             status: 'PENDING'
//           });

//           executeRun(retryRun._id);
//         }
//       }
//     );

//   } catch (err) {
//     console.error('❌ RUNNER EXCEPTION:', err.message);

//     await TestRun.findByIdAndUpdate(runId, {
//       status: 'FAILED',
//       results: {
//         summary: 'Runner crashed',
//         rawOutput: err.message,
//         durationMs: Date.now() - startTime,
//         failedTests: []
//       },
//       executedAt: new Date()
//     });
//   }
// }

// /* ---------------- HELPERS ---------------- */

// function extractFailedTests(output = '') {
//   return output
//     .split('\n')
//     .filter(
//       l =>
//         l.includes('✘') ||
//         l.toLowerCase().includes('failed')
//     )
//     .slice(0, 10);
// }

// function isFlakyFailure(output = '') {
//   const flakySignals = [
//     'TimeoutError',
//     'waiting for selector',
//     'element is not visible',
//     'locator.click',
//     'page.fill',
//     'Navigation timeout'
//   ];
//   return flakySignals.some(sig => output.includes(sig));
// }

// module.exports = { executeRun };
