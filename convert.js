import fs from 'fs';
import path from 'path';

const directoryPath = './'; // Adjust the path to your project

const regexRequire = /const (.*?) = require\('(.*?)'\);/g;
const regexModuleExports = /module\.exports = (.*);/g;

function convertToES6(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content
    .replace(regexRequire, "import $1 from '$2';")
    .replace(regexModuleExports, 'export default $1;');
  fs.writeFileSync(filePath, content);
}

function processDirectory(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js')) {
      convertToES6(fullPath);
    }
  });
}

processDirectory(directoryPath);
