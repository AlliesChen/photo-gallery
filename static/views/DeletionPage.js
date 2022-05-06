import FileHandler, {
  Doc,
  getFileName,
  setAppTitle,
} from "../controls/handler.js";

import { ImageReader } from "./ImageReader.js";

const DeletionPage = (() => {
  const app = Doc.getEl("app");
  const mainContent = Doc.getEl("fileContainer");
  const container = Doc.create("section");
  const confirmBtn = Doc.create("button");
  const cancelBtn = Doc.create("button");
  const btnContainer = Doc.create("div");

  container.setAttribute("class", "mask bg-black-trans flex-col-end");
  confirmBtn.setAttribute("class", "button--large text-magenta");
  confirmBtn.setAttribute("data-active", "false");
  confirmBtn.textContent = "刪除";
  cancelBtn.setAttribute("class", "button--large text-cyan");
  cancelBtn.setAttribute("data-active", "false");
  cancelBtn.textContent = "取消";
  btnContainer.setAttribute("class", "m-1 flex-col-between");
  btnContainer.appendChild(confirmBtn);
  btnContainer.appendChild(cancelBtn);
  container.appendChild(btnContainer);

  function open() {
    app.appendChild(container);
    cancelBtn.addEventListener("click", close);
    confirmBtn.addEventListener("click", deleteFiles);
    cancelBtn.setAttribute("data-active", "true");
    confirmBtn.setAttribute("data-active", "true");
  }

  function close() {
    app.removeChild(container);
    cancelBtn.removeEventListener("click", close);
    confirmBtn.removeEventListener("click", deleteFiles);
    cancelBtn.setAttribute("data-active", "false");
    confirmBtn.setAttribute("data-active", "false");
  }

  async function deleteFiles() {
    const onDeletionItems = Doc.queryAll(
      ".thumbnail-container[data-checked='true']"
    );
    // NOTE: match filename and ext from full src url
    const dataArr = Array.from(onDeletionItems).map((item) => {
      const image = item.firstChild;
      const imageSrc = image.currentSrc;
      return getFileName(imageSrc);
    });
    const jsonData = JSON.stringify(dataArr);
    try {
      const res = await axios.delete("/delete", {
        headers: {
          "Content-Type": "application/json",
        },
        data: jsonData,
      });
      // TODO: del
      const { open } = ImageReader;
      const deletedFiles = Object.keys(res.data);
      const imgNamesArr = (await FileHandler).imgNames;
      deletedFiles.forEach((file) => {
        const img = Doc.query(`img[src="/image-xs/${file}"]`);
        const imgContainer = img.closest(".thumbnail-container");
        const imgIndex = imgNamesArr.indexOf(file);
        imgNamesArr.splice(imgIndex, 1);
        while (imgContainer.firstChild) {
          imgContainer.removeChild(imgContainer.lastChild);
        }
        mainContent.removeChild(imgContainer);
      });
      setAppTitle();
      Doc.getEl("selectedCount").textContent = "0";
      Doc.getEl("deletionButton").setAttribute("disabled", "true");
      Doc.getEl("app").addEventListener("click", open);
      return deleteFiles;
    } catch (err) {
      throw new Error(err);
    }
  }
  return { open };
})();

export { DeletionPage };
