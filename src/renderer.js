const { remote, ipcRenderer } = require("electron");
const marked = require("marked");

const mainProcess = remote.require("./main");
const currentWindow = remote.getCurrentWindow();

const viewMarkdown = document.querySelector("#markdown");
const viewHtml = document.querySelector("#html");
const btnNewFile = document.querySelector("#new-file");
const btnOpenFile = document.querySelector("#open-file");
const btnSaveMarkdown = document.querySelector("#save-markdown");
const btnRevert = document.querySelector("#revert");
const btnSaveHtml = document.querySelector("#save-html");
const btnShowFile = document.querySelector("#show-file");
const btnOpenDefault = document.querySelector("#open-in-default");

const renderMarkdownToHtml = markdown => {
  viewHtml.innerHTML = marked(markdown, { sanitize: true });
};

viewMarkdown.addEventListener("keyup", event => {
  const content = event.target.value;
  renderMarkdownToHtml(content);
});

btnOpenFile.addEventListener("click", () => {
  mainProcess.getMarkdownFromFile(currentWindow);
});

btnNewFile.addEventListener("click", () => {
  mainProcess.createWindow();
})

ipcRenderer.on('file-opened', (event, file, content) => {
  viewMarkdown.value = content;
  renderMarkdownToHtml(content);
})
