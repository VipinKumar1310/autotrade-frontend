// Script to generate PWA icons
// Run: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

// Simple PNG generator using raw bytes (creates a basic colored square icon)
function createPNG(size, color, filename) {
  // This creates a simple solid color PNG
  // For production, use a proper icon design tool or library like 'sharp' or 'canvas'
  
  const { createCanvas } = require('canvas');
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, size, size);
  
  // Draw a simple "A" logo
  ctx.fillStyle = '#22c55e'; // Green color
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('A', size / 2, size / 2);
  
  // Add a subtle border
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = size * 0.02;
  ctx.strokeRect(size * 0.05, size * 0.05, size * 0.9, size * 0.9);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Created: ${filename}`);
}

function createMaskablePNG(size, color, filename) {
  const { createCanvas } = require('canvas');
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Maskable icons need safe zone (inner 80%)
  // Background fills entire canvas
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, size, size);
  
  // Content in safe zone (center 80%)
  const safeZone = size * 0.1;
  const safeSize = size * 0.8;
  
  ctx.fillStyle = '#22c55e';
  ctx.font = `bold ${safeSize * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('A', size / 2, size / 2);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Created: ${filename}`);
}

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

try {
  // Generate regular icons
  createPNG(192, '#22c55e', path.join(iconsDir, 'icon-192.png'));
  createPNG(512, '#22c55e', path.join(iconsDir, 'icon-512.png'));
  
  // Generate maskable icons
  createMaskablePNG(192, '#22c55e', path.join(iconsDir, 'icon-maskable-192.png'));
  createMaskablePNG(512, '#22c55e', path.join(iconsDir, 'icon-maskable-512.png'));
  
  console.log('\n✅ All PWA icons generated successfully!');
  console.log('Icons are in: public/icons/');
} catch (error) {
  console.error('Error generating icons:', error.message);
  console.log('\nTo generate icons, install canvas first:');
  console.log('npm install canvas --save-dev');
  console.log('\nOr use an online tool like https://www.pwabuilder.com/imageGenerator');
}

