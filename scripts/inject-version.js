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

// Get git version - prioritize exact tag match for releases
let gitVersion = 'unknown';
let gitCommit = 'unknown';
let gitCommitShort = 'unknown';
let isRelease = false;

try {
    // First, check if we're exactly on a tag (release version)
    try {
        const exactTag = execSync('git describe --exact-match --tags HEAD', { 
            cwd: rootDir,
            encoding: 'utf-8',
            stdio: 'pipe'
        }).trim();
        gitVersion = exactTag;
        isRelease = true;
    } catch (e) {
        // Not on exact tag, use describe with fallback
        gitVersion = execSync('git describe --always --tags --dirty', { 
            cwd: rootDir,
            encoding: 'utf-8',
            stdio: 'pipe'
        }).trim();
        
        // Check if version starts with a tag (e.g., "v1.1.0-2-gabc123")
        // If it does, extract just the tag part for cleaner display
        const tagMatch = gitVersion.match(/^(v?\d+\.\d+\.\d+)/);
        if (tagMatch) {
            // We're close to a tag, but not exactly on it
            gitVersion = gitVersion; // Keep full describe for dev builds
        }
    }
    
    // Get commit info for reference
    try {
        gitCommit = execSync('git rev-parse HEAD', { 
            cwd: rootDir,
            encoding: 'utf-8',
            stdio: 'pipe'
        }).trim();
        gitCommitShort = gitCommit.substring(0, 7);
    } catch (e) {
        // Ignore commit fetch errors
    }
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
    isRelease: isRelease,
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
console.log(`   Version: ${gitVersion}${isRelease ? ' (Release)' : ''}`);
console.log(`   Build Time: ${buildTimeLocal}`);

export default versionInfo;

