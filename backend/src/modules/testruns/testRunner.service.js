const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

exports.runTestSafe = async (testCode) => {
    return new Promise((resolve) => {
        // 1. Setup Temp Directory
        const tempDir = path.join(__dirname, '../../../temp_runs');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        // 2. Wrap Code (If it's just steps, wrap them in a Playwright test)
        const filename = `run-${Date.now()}-${Math.floor(Math.random() * 1000)}.spec.js`;
        const filePath = path.join(tempDir, filename);

        let finalCode = testCode;
        if (!testCode.includes('import { test')) {
            finalCode = `
import { test, expect } from '@playwright/test';
test('AI Generated Test', async ({ page }) => {
    test.setTimeout(30000); // 30s Timeout
    ${testCode}
});`;
        }

        // 3. Write File
        fs.writeFileSync(filePath, finalCode);

        // 4. Spawn Process (Safe & Isolated)
        const child = spawn('npx', ['playwright', 'test', filePath, '--reporter=line'], {
            shell: true,
            cwd: path.join(__dirname, '../../../') // Root of backend
        });

        let output = '';
        
        child.stdout.on('data', (d) => output += d.toString());
        child.stderr.on('data', (d) => output += d.toString());

        child.on('close', (code) => {
            // Cleanup file
            try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) {}

            resolve({
                passed: code === 0,
                logs: output || 'No logs captured.'
            });
        });

        // 5. Safety Timeout (Kill if > 45s)
        setTimeout(() => {
            if (!child.killed) {
                child.kill();
                resolve({ passed: false, logs: 'TIMEOUT: Test process terminated.' });
            }
        }, 45000);
    });
};