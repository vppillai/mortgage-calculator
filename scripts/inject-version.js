#!/usr/bin/env node

/**
 * Inject version and build time information into the build
 */

import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Get git version
let gitVersion = 'unknown';
let gitCommit = 'unknown';
let gitCommitShort = 'unknown';

try {
    gitVersion = execSync('git describe --always --tags --dirty', { 
        cwd: rootDir,
        encoding: 'utf-8',
        stdio: 'pipe'
    }).trim();
} catch (e) {
    // Try alternative methods
    try {
        gitCommit = execSync('git rev-parse HEAD', { 
            cwd: rootDir,
            encoding: 'utf-8',
            stdio: 'pipe'
        }).trim();
        gitCommitShort = gitCommit.substring(0, 7);
        gitVersion = gitCommitShort;
    } catch (e2) {
        // Use timestamp if git is unavailable
        gitVersion = 'dev-' + Date.now();
    }
}

// Get build time
const buildTime = new Date().toISOString();
const buildTimeLocal = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
});

// Create version info object
const versionInfo = {
    version: gitVersion,
    commit: gitCommit !== 'unknown' ? gitCommit : undefined,
    commitShort: gitCommitShort !== 'unknown' ? gitCommitShort : undefined,
    buildTime: buildTime,
    buildTimeLocal: buildTimeLocal,
};

// Write to public directory for runtime access
const publicDir = join(rootDir, 'public');
const versionFile = join(publicDir, 'version.json');

writeFileSync(versionFile, JSON.stringify(versionInfo, null, 2), 'utf-8');

// Also write as JS module for import
const versionJsFile = join(publicDir, 'version.js');
writeFileSync(versionJsFile, `export default ${JSON.stringify(versionInfo, null, 2)};`, 'utf-8');

console.log('✅ Version info injected:');
console.log(`   Version: ${gitVersion}`);
console.log(`   Build Time: ${buildTimeLocal}`);

export default versionInfo;

