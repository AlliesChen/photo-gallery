import FileHandler, {
  Doc,
  setAppTitle,
  setThumbnails,
} from "./controls/handler.js";

import {
  setCancelSelectionEvent,
  setFileInputUploadEvent,
  setSelectFileEvent,
} from "./controls/events.js";

import { ImageReader } from "./views/ImageReader.js";

async function initApp() {
  const imgNames = (await FileHandler).imgNames;
  const mainContent = Doc.getEl("fileContainer");
  const images = setThumbnails(imgNames);
  const { open } = await ImageReader;
  setAppTitle();
  images.forEach((image) => {
    mainContent.appendChild(image);
  });
  mainContent.addEventListener("click", open);
}

document.addEventListener("DOMContentLoaded", () => {
  // Having feather icon to replace <i> tags with its icons
  feather.replace();
  const fileInput = Doc.getEl("fileInput");
  const selectionButton = Doc.getEl("selectionButton");
  const cancelButton = Doc.getEl("cancelButton");
  fileInput.addEventListener("change", setFileInputUploadEvent);
  selectionButton.addEventListener("click", setSelectFileEvent);
  cancelButton.addEventListener("click", setCancelSelectionEvent);
  initApp();
});
