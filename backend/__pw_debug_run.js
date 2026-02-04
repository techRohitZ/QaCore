const { spawn } = require('child_process');
const path = require('path');

const playwrightCmd = path.join(
  process.cwd(),
  'node_modules',
  '.bin',
  'playwright.cmd'
);

console.log('Starting Playwright…');

const child = spawn(
  playwrightCmd,
  ['test', '--list'],
  {
    shell: true,
    cwd: process.cwd(),
    stdio: 'inherit'
  }
);

child.on('exit', code => {
  console.log('EXIT EVENT, code =', code);
});

child.on('close', code => {
  console.log('CLOSE EVENT, code =', code);
});

child.on('error', err => {
  console.error('ERROR EVENT', err);
});
