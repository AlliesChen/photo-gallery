import FileHandler, {
  cancelSelection,
  Doc,
  setAppTitle,
  setItemChecked,
  setThumbnails,
  toggleFooter,
  uploadFiles,
} from "./handler.js";

import { DeletionPage } from "../views/DeletionPage.js";
import { ImageReader } from "../views/ImageReader.js";

export async function setFileInputUploadEvent(e) {
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

export async function setCancelSelectionEvent(e) {
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

export async function setSelectFileEvent(e) {
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
