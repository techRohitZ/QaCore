const mongoose = require('mongoose');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TestRun = require('../modules/testruns/testrun.model');
const { generateSpec } = require('../modules/runner/specGenerator');

require('dotenv').config();

async function run() {
  const runId = process.argv[2];
  if (!runId) process.exit(1);

  await mongoose.connect(process.env.MONGO_URI);

  const run = await TestRun.findById(runId)
    .populate('testCaseRef')
    .populate('project');

  if (!run) process.exit(1);

  await TestRun.findByIdAndUpdate(runId, { status: 'RUNNING' });

  const runnerDir = path.join(__dirname, '../modules/runner');
  const specPath = path.join(runnerDir, `run-${runId}.spec.js`);

  fs.writeFileSync(
    specPath,
    generateSpec(run.testCaseRef.testCases, run.project.url)
  );

  try {
    execSync(`npx playwright test "${specPath}" --workers=1`, {
      stdio: 'pipe'
    });

    await TestRun.findByIdAndUpdate(runId, {
      status: 'PASSED',
      executedAt: new Date()
    });
  } catch (err) {
    await TestRun.findByIdAndUpdate(runId, {
      status: 'FAILED',
      results: { error: err.message },
      executedAt: new Date()
    });
  }

  process.exit(0);
}

run();
