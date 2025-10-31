#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');

function createSVGIcon(size) {
    return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1e40af" rx="${size * 0.12}"/>
  <text x="${size/2}" y="${size * 0.65}" font-family="Arial, sans-serif" font-size="${size * 0.5}" font-weight="bold" text-anchor="middle" fill="white">$</text>
</svg>`;
}

async function generateIcons() {
    console.log('Generating PWA icons...');
    
    const sizes = [192, 512];
    const promises = sizes.map(async (size) => {
        const svgBuffer = Buffer.from(createSVGIcon(size));
        const pngBuffer = await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toBuffer();
        
        writeFileSync(join(publicDir, `pwa-${size}x${size}.png`), pngBuffer);
        console.log(`✅ Created pwa-${size}x${size}.png`);
    });
    
    const appleSVG = Buffer.from(createSVGIcon(180));
    const applePNG = await sharp(appleSVG).resize(180, 180).png().toBuffer();
    writeFileSync(join(publicDir, 'apple-touch-icon.png'), applePNG);
    console.log('✅ Created apple-touch-icon.png');
    
    const faviconSVG = Buffer.from(createSVGIcon(16));
    const faviconICO = await sharp(faviconSVG).resize(16, 16).png().toBuffer();
    writeFileSync(join(publicDir, 'favicon.ico'), faviconICO);
    console.log('✅ Created favicon.ico');
    
    await Promise.all(promises);
    console.log('✅ All icons generated!');
}

generateIcons().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});
