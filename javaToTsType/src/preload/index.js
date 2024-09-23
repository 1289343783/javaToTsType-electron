import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

//渲染器的自定义API
const electronApi = {};

//使用`contextBridge` API将Electron API暴露给
//仅当启用了上下文隔离时才渲染器，否则
//只需添加到DOM全局。
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("electronApi", electronApi);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = electronApi;
}
