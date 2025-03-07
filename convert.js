// const fs = require('fs');
// const path = require('path');

// const directoryPath = './'; // Adjust the path to your project

// const regexRequire = /const (.*?) = require\('(.*?)'\);/g;
// const regexModuleExports = /module\.exports = (.*);/g;

// function convertToES6(filePath) {
//   let content = fs.readFileSync(filePath, 'utf8');
//   content = content
//     .replace(regexRequire, "const $1 = require('$2');")
//     .replace(regexModuleExports, 'module.exports = $1;');
//   fs.writeFileSync(filePath, content);
// }

// function processDirectory(dir) {
//   fs.readdirSync(dir).forEach((file) => {
//     const fullPath = path.join(dir, file);
//     if (fs.statSync(fullPath).isDirectory()) {
//       processDirectory(fullPath);
//     } else if (file.endsWith('.js')) {
//       convertToES6(fullPath);
//     }
//   });
// }

// processDirectory(directoryPath);


const fs = require('fs');
const path = require('path');

const directoryPath = './'; // Adjust the path to your project

const regexImport = /const (.*?) = require('(.*?)');/g;
const regexExportDefault = /module.exports = (.*);/g;
const regexExportConst = //g;

function convertToCommonJS(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Convert named exports (export const) to a module.exports object
  const namedExports = [];
  content = content.replace(regexExportConst, (match, name, value) => {
    namedExports.push(`${name}: ${value}`);
    return ''; // Remove the original export line
  });

  // If there are named exports, add them to module.exports
  if (namedExports.length > 0) {
    content += `\nmodule.exports = { ${namedExports.join(', ')} };\n`;
  }

  // Convert import statements to require
  content = content.replace(regexImport, "const $1 = require('$2');");

  // Convert export default to module.exports
  content = content.replace(regexExportDefault, 'module.exports = $1;');

  fs.writeFileSync(filePath, content);
}

function processDirectory(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js')) {
      convertToCommonJS(fullPath);
    }
  });
}

processDirectory(directoryPath);

