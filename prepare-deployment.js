#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Preparing files for Hostinger deployment...\n');

// Check if dist/public exists
const distPath = path.join(__dirname, 'dist', 'public');
if (!fs.existsSync(distPath)) {
  console.error('❌ Error: dist/public directory not found!');
  console.log('💡 Please run "npm run build" first');
  process.exit(1);
}

// List all files that need to be uploaded
console.log('📁 Files to upload to Hostinger:');
console.log('=====================================');

function listFiles(dir, prefix = '') {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const relativePath = path.relative(distPath, fullPath);
    
    if (stat.isDirectory()) {
      console.log(`${prefix}📁 ${relativePath}/`);
      listFiles(fullPath, prefix + '  ');
    } else {
      const size = (stat.size / 1024).toFixed(1);
      console.log(`${prefix}📄 ${relativePath} (${size} KB)`);
    }
  });
}

listFiles(distPath);

console.log('\n📋 Deployment Checklist:');
console.log('========================');
console.log('✅ 1. Run "npm run build" (completed)');
console.log('⏳ 2. Upload ALL files from dist/public/ to Hostinger');
console.log('⏳ 3. Add .htaccess file to Hostinger root');
console.log('⏳ 4. Update API endpoints to point to AWS backend');
console.log('⏳ 5. Test the deployed frontend');

console.log('\n🔧 Important Notes:');
console.log('===================');
console.log('• Upload ALL files and folders from dist/public/');
console.log('• Maintain the exact folder structure');
console.log('• Don\'t forget the .htaccess file for React routing');
console.log('• Update API URLs before final deployment');

console.log('\n📞 Need help? Check DEPLOYMENT_GUIDE.md for detailed instructions'); 