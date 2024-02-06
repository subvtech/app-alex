import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let vueFiles = [];

function listVueFiles(directoryPath) {
  const files = readdirSync(directoryPath);

  files.forEach((file) => {
    const fullPath = path.join(directoryPath, file);

    if (statSync(fullPath).isDirectory()) {
      listVueFiles(fullPath);
    } else {
      const [filename, ext] = file.split('.');
      if (ext === 'vue') {
        const fileContent = readFileSync(fullPath, 'utf-8');
        const interfaceIndex = fileContent.indexOf('export interface');
       
        if (interfaceIndex !== -1) {
          const interfaceToEnd = fileContent.slice(interfaceIndex);
          const emptyLineIndex = interfaceToEnd.indexOf('}\r\n');
          if (emptyLineIndex !== -1) {
            const interfaceToEmptyLine = interfaceToEnd.slice(0, emptyLineIndex + 1);
            console.log(interfaceToEmptyLine); // or do something else with it
          }
        }
      }
    }
  });
}

listVueFiles(path.join(__dirname, '../components'));
