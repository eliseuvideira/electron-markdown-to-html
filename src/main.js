const { app, BrowserWindow, dialog } = require("electron");
const fs = require("fs");

let mainWindow = null;

const openFile = file => {
  const content = fs.readFileSync(file).toString();
  mainWindow.webContents.send("file-opened", file, content);
};

const getMarkdownFromFile = async () => {
  const response = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [
      { name: "Text Files", extensions: ["txt"] },
      { name: "Markdown Files", extensions: ["md", "markdown"] }
    ]
  });
  if (!response.canceled && response.filePaths.length > 0) {
    openFile(response.filePaths[0]);
  }
};

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: true }
  });
  mainWindow.loadFile(__dirname + "/index.html");
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

module.exports = { getMarkdownFromFile };
