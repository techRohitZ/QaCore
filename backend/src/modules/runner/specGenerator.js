/** Compile a deliberately small instruction language. Unknown steps fail explicitly. */
function compileStep(step) {
  let match;
  if (/^(open|navigate to|go to)( the)?( target)?( page| url| website)?\.?$/i.test(step.trim())) {
    return "await page.goto(url, { waitUntil: 'domcontentloaded' });";
  }
  if ((match = step.match(/^click "([^"]+)"$/i))) {
    return `await page.getByRole('button', { name: ${JSON.stringify(match[1])}, exact: true }).click();`;
  }
  if ((match = step.match(/^fill "([^"]+)" with "([^"]*)"$/i))) {
    return `await page.getByLabel(${JSON.stringify(match[1])}, { exact: true }).fill(${JSON.stringify(match[2])});`;
  }
  if ((match = step.match(/^verify text "([^"]+)"$/i))) {
    return `await expect(page.getByText(${JSON.stringify(match[1])}, { exact: true })).toBeVisible();`;
  }
  if ((match = step.match(/^verify title "([^"]+)"$/i))) {
    return `await expect(page).toHaveTitle(${JSON.stringify(match[1])});`;
  }
  return `throw new Error(${JSON.stringify(`Unsupported step; review before running: ${step}`)});`;
}

function generateSpec(testCases, projectUrl, runId = 'local') {
  if (!Array.isArray(testCases) || !testCases.length) throw new Error('No test cases to execute.');
  const tests = testCases.map((tc, index) => {
    const steps = Array.isArray(tc.steps) ? tc.steps : (tc.code || '').split('\n').filter(Boolean);
    const assertions = steps.some(step => /^verify (text|title) "[^\"]+"$/i.test(step));
    const statements = steps.map(compileStep);
    if (!assertions) statements.push("throw new Error('No supported assertion. Review this scenario before running.');");
    return `test(${JSON.stringify(`[run-${runId}] ${tc.title || `Scenario ${index + 1}`}`)}, async ({ page }) => {\n  const url = ${JSON.stringify(tc.targetUrl || projectUrl)};\n  await page.goto(url, { waitUntil: 'domcontentloaded' });\n  ${statements.join('\n  ')}\n});`;
  });
  return "const { test, expect } = require('@playwright/test');\ntest.use({ actionTimeout: 10000, navigationTimeout: 20000 });\n" + tests.join('\n');
}
module.exports = { generateSpec, compileStep };
