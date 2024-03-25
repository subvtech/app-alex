// import { BrowserWindow } from "electron";
// import { platform } from "os";
// import path from 'path'
// import { shell } from "electron";
// import isDev from "electron-is-dev";
// const AdmZip = require("adm-zip");

// const plataforma = platform();
// let url: string = ''
// console.log("Sistema Operacional:", plataforma);

// if (plataforma === "win32") {
//     url = "https://github.com/ipfs/ipfs-desktop/releases/download/v0.33.0/IPFS-Desktop-Setup-0.33.0.exe"
// } else if (plataforma === "darwin") {
//   url = "https://github.com/ipfs/ipfs-desktop/releases/download/v0.33.0/ipfs-desktop-0.33.0-mac.dmg"
// } else if (plataforma === "linux") {
//     url = "https://github.com/ipfs/ipfs-desktop/releases/download/v0.33.0/ipfs-desktop-0.33.0-linux-amd64.deb"
// } else {
//   console.log("Sistema Operacional não reconhecido:", plataforma);
// }

// const ipfs_download = createWindow();
// ipfs_download.webContents.downloadURL(url);