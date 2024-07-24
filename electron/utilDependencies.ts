import path from 'path';
import { writeFile, existsSync } from 'fs';
import { shell } from 'electron';
import AdmZip from 'adm-zip';

function createIfNotExists(caminho: string): boolean {
  if (!existsSync(caminho)) {
    const date = new Date();
    const conteudoInicial = JSON.stringify(
      {
        installed: true,
        IPFS_version: '0.33.0',
        Date: `${date.getDate()}/${
          new Date().getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
      },
      null,
      2,
    );
    writeFile(caminho, conteudoInicial, () => {});
    return true;
  }
  return false;
}

function installDependencies(caminho: string): void {
  console.log(`${process.env.ROOT!}/${caminho}`);
  shell.openPath(
    path.join(process.env.ROOT!, `${caminho}IPFS-Desktop-0.33.0.exe`),
  );
  const zip: AdmZip = new AdmZip(
    path.join(
      process.env.ROOT!,
      `${caminho}ipfs-cluster-service_v1.0.8_windows-amd64.zip`,
    ),
  );
  zip.extractAllTo(path.join(process.env.ROOT!, `${caminho}`));
  shell.openPath(
    path.join(
      process.env.ROOT!,
      `${caminho}ipfs-cluster-service/ipfs-cluster-service.exe`,
    ),
  );
}

export { createIfNotExists, installDependencies };
