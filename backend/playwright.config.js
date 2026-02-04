// const { defineConfig } = require('@playwright/test');

// module.exports = defineConfig({
//   testDir: 'tests',
//   timeout: 30000,
//   use: {
//     headless: true,
//     screenshot:'only-on-failure'
//   }
// });
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // ✅ Run only generated specs (no manual tests affected)
  testDir: 'tests/generated',

  // ✅ Keep your existing timeout
  timeout: 30000,

  // ✅ IMPORTANT: retries handled by your runner logic
  retries: 0,

  // ✅ CI-friendly reporters (does NOT affect local runs)
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/report.json' }]
  ],

  use: {
    headless: true,

    // ✅ Keep your existing screenshot behavior
    screenshot: 'only-on-failure',

    // ✅ Explicit for CI stability
    video: 'off',
    trace: 'off'
  }
});

