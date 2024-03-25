import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { shell } from "electron";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import isDev from "electron-is-dev";
const AdmZip = require("adm-zip");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
  return new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload,
      nodeIntegrationInWorker: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
    },
  });
};
process.env.ROOT = path.join(__dirname, "..");
process.env.DIST = path.join(process.env.ROOT, "dist-electron");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, "public")
  : path.join(process.env.ROOT, ".output/public");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const preload = path.join(process.env.DIST, "preload.js");

const pathToEXE = isDev ? "release/win-unpacked/resources/downloads/" : "../../resources/downloads/"
app.whenReady().then(async () => {  
  try {
    // shell.openPath(path.join(process.env.ROOT!, `${pathToEXE}IPFS-Desktop-0.33.0.exe`));
    // let zip = new AdmZip(path.join(process.env.ROOT!, `${pathToEXE}ipfs-cluster-service_v1.0.8_windows-amd64.zip`));
    // zip.extractAllTo(path.join(process.env.ROOT!, `${pathToEXE}`));
    // shell.openPath(path.join(process.env.ROOT!, `${pathToEXE}ipfs-cluster-service/ipfs-cluster-service.exe`));
  } catch (e) {
    console.log(e);
  }
  
  const main = createWindow();  
  process.env.VITE_DEV_SERVER_URL
    ? main.loadURL(process.env.VITE_DEV_SERVER_URL)
    : main.loadFile(path.join(process.env.VITE_PUBLIC!, "index.html"));

  let init = exec(
    `${path.join(process.env.ROOT!, `${pathToEXE}ipfs-cluster-service/ipfs-cluster-service.exe`)} init -f ipns://k51qzi5uqu5dkz7hakn5fjvwz0vlv55wjlkw2cjb8noukucrpmfo7s6s1scxmh/`,
    (error, stdout: string, stderr: string) => {
      console.log(error), console.log(stderr), console.log(stdout);
    }
  );
  let bootstrap = exec(
    `${path.join(process.env.ROOT!, `${pathToEXE}ipfs-cluster-service/ipfs-cluster-service.exe`)} -f daemon --bootstrap /ip4/127.0.0.1/tcp/9092/p2p/12D3KooWR8MxQgHGLF5vx1ShZy3Dkb5ZMjgm5MjVpJaDpi1Qqpwp`,
    // ipfs-cluster-service daemon --bootstrap /ip4/127.0.0.1/tcp/9092/p2p/12D3KooWR8MxQgHGLF5vx1ShZy3Dkb5ZMjgm5MjVpJaDpi1Qqpwp
    (error, stdout: string, stderr: string) => {
      console.log(error), console.log(stderr), console.log(stdout);
    }
  );
});

// ipcMain.on("click", (event, args) => {
//   console.log(args);
//   event.sender.send("click", "teste");
// });
