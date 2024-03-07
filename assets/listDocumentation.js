import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readdirSync, writeFileSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const vueFiles = [];

function listVueFiles(directoryPath) {
  const files = readdirSync(directoryPath);

  files.forEach((file) => {
    const fullPath = path.join(directoryPath, file);

    if (statSync(fullPath).isDirectory()) {
      listVueFiles(fullPath);
    } else {
      const [filename, ext] = file.split('.');
      if (ext === 'vue') {
        const namespaces = fullPath.split('pages\\components\\')[1].split('\\');
        if (namespaces[0] === 'index.vue') return;
        namespaces[namespaces.length - 1] = filename;
        vueFiles.push({
          namespaces,
        });
      }
    }
  });
}

listVueFiles(path.join(__dirname, '../pages/components'));

writeFileSync('assets/vueFiles.json', JSON.stringify(vueFiles, null, 2));
