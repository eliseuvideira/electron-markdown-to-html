const { app, BrowserWindow, dialog } = require("electron");
const fs = require("fs");

const windows = new Set();

const createWindow = () => {
  let x, y;
  const currentWindow = BrowserWindow.getFocusedWindow();

  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition();
    x = currentWindowX + 10;
    y = currentWindowY + 10;
  }

  let newWindow = new BrowserWindow({
    x,
    y,
    show: false,
    webPreferences: { nodeIntegration: true }
  });
  newWindow.loadFile(__dirname + "/index.html");
  newWindow.once("ready-to-show", () => {
    newWindow.show();
  });
  newWindow.on("closed", () => {
    windows.delete(newWindow);
    newWindow = null;
  });
  windows.add(newWindow);
  return newWindow;
};

const openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString();
  targetWindow.webContents.send("file-opened", file, content);
};

const getMarkdownFromFile = async targetWindow => {
  const response = await dialog.showOpenDialog(targetWindow, {
    properties: ["openFile"],
    filters: [
      { name: "Text Files", extensions: ["txt"] },
      { name: "Markdown Files", extensions: ["md", "markdown"] }
    ]
  });
  if (!response.canceled && response.filePaths.length > 0) {
    openFile(targetWindow, response.filePaths[0]);
  }
};

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform === "darwin") {
    return false;
  }
  app.quit();
});

app.on("activate", (event, hasVisibleWindows) => {
  if (!hasVisibleWindows) {
    createWindow();
  }
});

module.exports = { getMarkdownFromFile, createWindow };
