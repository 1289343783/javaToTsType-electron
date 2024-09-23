import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";

const fs = require("fs");
//写入数据到json文件
const writeJsonFile = (_, obj) => {
  const data = JSON.stringify(obj);
  fs.writeFileSync(join(__dirname, "../../resources/codeHistory.json").replace("app.asar", "app.asar.unpacked"), data, (err) => {
    if (err) throw err;
    console.log("数据已写入文件");
  });
};

// 异步读取文件
const readJsonFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(join(__dirname, "../../resources/codeHistory.json").replace("app.asar", "app.asar.unpacked"), "utf8", (err, data) => {
      if (err) reject(err);
      if (data.length === 0) {
        resolve([]);
      } else {
        // 将JSON字符串转换为对象
        const obj = JSON.parse(data);
        resolve(obj);
      }
    });
  });
};

//删除json文件中的选项
const deleteJson = (_, id) => {
  return new Promise((resolve, reject) => {
    fs.readFile(join(__dirname, "../../resources/codeHistory.json").replace("app.asar", "app.asar.unpacked"), "utf8", (err, data) => {
      if (err) reject(err);
      const person = JSON.parse(data);
      //把数据读出来删除
      for (var i = 0; i < person.length; i++) {
        if (id === person[i].id) {
          person.splice(i, 1);
        }
      }
      console.log(person);
      const str = JSON.stringify(person);
      //然后再把数据写进去
      fs.writeFileSync(join(__dirname, "../../resources/codeHistory.json").replace("app.asar", "app.asar.unpacked"), str, function(err) {
        if (err) {
          console.error(err);
        }
      });
    });
  });
};


function createWindow() {
  //创建浏览器窗口。
  const mainWindow = new BrowserWindow({
    width: 900, height: 600, show: true, frame: false, //隐藏窗口边框
    titleBarStyle: "custom", movable: true, // 可否移动
    autoHideMenuBar: true, //隐藏菜单栏
    icon: join(__dirname, "../../resources/icon.png"),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      nodeIntegration: true,
      sandbox: false
    }
  });
  // 隐藏滚动条
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.insertCSS(`::-webkit-scrollbar { display: none; }`);
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });


  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  ipcMain.on("save-json-data", writeJsonFile);
  ipcMain.on("del-json-data", deleteJson);
  ipcMain.handle("read-json-data", readJsonFile);

  // 窗口最小化
  ipcMain.on("window-min", () => {
    mainWindow.minimize();
  });
  // 窗口最大化
  ipcMain.on("window-max", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });
  // 窗口关闭
  ipcMain.on("window-close", () => {
    mainWindow.close();
  });

  //基于electronic-vite-cli的渲染器HMR。
  //加载用于开发的远程URL或用于生产的本地html文件。
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  // 为windows设置应用程序用户模型id
  electronApp.setAppUserModelId("com.electron");

  //开发中默认按F12打开或关闭DevTools
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  //IPC测试
  ipcMain.on("ping", () => console.log("pong"));

  createWindow();

  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

