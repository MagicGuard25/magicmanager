// Script to modify the source code to completely remove first-guide
// This script will be used to process the JavaScript files

const fs = require('fs');
const path = require('path');

// Directory containing the JavaScript files
const jsDir = path.join(__dirname, 'static', 'js');

// Function to process a JavaScript file
function processJsFile(filePath) {
  console.log(`Processing file: ${filePath}`);
  
  // Read the file content
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove references to first-guide route
  content = content.replace(/to:["']\/first-guide["']/g, 'to:"#"');
  
  // Remove the entire cell group containing first-guide
  const firstGuideMenuRegex = /Object\(r\["createVNode"\]\)\(u,\{inset:"",style:\{"margin-top":"20px"}\},\{default:Object\(r\["withCtx"\]\)\(\(\)=>\[Object\(r\["createVNode"\]\)\(b,\{center:"",title:e\.\$t\("setting\.firstGuideTitle"\),label:e\.\$t\("setting\.firstGuideLabel"\),to:"\/first-guide","is-link":"".*?\}\),_:1\}\)/gs;
  content = content.replace(firstGuideMenuRegex, 'Object(r["createCommentVNode"])("First Guide Removed")');
  
  // Write the modified content back to the file
  fs.writeFileSync(filePath, content);
  
  return content;
}

// Function to process all JavaScript files in a directory
function processJsDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processJsDirectory(filePath);
    } else if (file.endsWith('.js')) {
      processJsFile(filePath);
    }
  }
}

// Start processing
console.log('Starting to remove first-guide from source code...');
processJsDirectory(jsDir);
console.log('Finished removing first-guide from source code.');
