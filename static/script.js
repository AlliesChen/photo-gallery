import FileHandler, {
  Doc,
  uploadFiles,
  setThumbnails,
  setAppTitle,
  cancelSelection,
  setItemChecked,
  toggleFooter,
} from "./controls/handler.js";

import { ImageReader } from "./views/ImageReader.js";
import { DeletionPage } from "./views/DeletionPage.js";

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

async function setFileInputUploadEvent(e) {
  const url = "/upload";
  const fileSet = e.target.files;
  const response = await uploadFiles(url, fileSet);
  const newFilesNames = response.data;
  const mainContent = Doc.getEl("fileContainer");
  const newFiles = setThumbnails(newFilesNames);
  newFiles.forEach((file) => {
    mainContent.insertBefore(file, mainContent.firstChild);
  });
  (await FileHandler).imgNames.unshift(...newFilesNames);
  setAppTitle();
}

async function setCancelSelectionEvent(e) {
  const mainContent = Doc.getEl("fileContainer");
  const deletionBtn = Doc.getEl("deletionButton");
  const { open } = await ImageReader;
  cancelSelection();
  // NOTE: data-active === 'true' show the button;
  // NOTE: data-active === 'false' hide the button;
  e.target.setAttribute("data-active", "false");
  Doc.getEl("fileInput").removeAttribute("disabled");
  Doc.getEl("selectionButton").setAttribute("data-active", "ture");
  mainContent.addEventListener("click", open);
  deletionBtn.removeEventListener("click", DeletionPage.open);
  toggleFooter();
}

async function setSelectFileEvent(e) {
  const thumbnailContainer = Doc.queryAll(".thumbnail-container");
  const mainContent = Doc.getEl("fileContainer");
  const deletionBtn = Doc.getEl("deletionButton");
  const { open } = await ImageReader;
  // NOTE: data-active === 'true' show the button;
  // NOTE: data-active === 'false' hide the button;
  e.target.setAttribute("data-active", "false");
  Doc.getEl("fileInput").setAttribute("disabled", "true");
  Doc.getEl("cancelButton").setAttribute("data-active", "ture");
  thumbnailContainer.forEach((item) => {
    if (item.getAttribute("data-active") === "true") {
      item.setAttribute("data-active", "false");
    } else {
      item.setAttribute("data-active", "true");
    }
  });
  mainContent.removeEventListener("click", open);
  mainContent.addEventListener("click", setItemChecked);
  toggleFooter();
  deletionBtn.addEventListener("click", DeletionPage.open);
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
