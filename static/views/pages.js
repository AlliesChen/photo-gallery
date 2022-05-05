import FileHandler, {
  Doc,
  createImage,
  getFileName,
  cancelSelection,
  setAppTitle,
} from "../controls/handler.js";

const ImageReader = (async () => {
  const app = Doc.getEl("app");
  const container = Doc.create("article");
  const header = Doc.create("header");
  const section = Doc.create("section");
  const footer = Doc.create("footer");
  const cancelButton = Doc.create("div");
  const fileNames = (await FileHandler).imgNames;
  let index = 0;
  let touchstartX = 0;
  let touchendX = 0;

  function close() {
    section.removeChild(section.firstChild);
    container.remove();
    Doc.getEl("app").classList.remove("overflow-hidden");
  }

  function setHeader() {
    header.textContent = `${index + 1}/${fileNames.length}`;
  }

  function setFooter(name) {
    // transform from fileName to yyyy/mm/dd
    footer.textContent = `${name.substring(0, 4)}/${name.substring(
      4,
      6
    )}/${name.substring(6, 8)}`;
  }

  function setSwipe(e) {
    if (e.target.nodeName !== "IMG") return;
    if (e.type === "touchstart") {
      touchstartX = e.changedTouches[0].screenX;
      return;
    }
    if (e.type === "touchend") {
      touchendX = e.changedTouches[0].screenX;
    }
    const swipeDirection = touchendX - touchstartX;
    if (swipeDirection < -100 && index < fileNames.length - 1) {
      index += 1;
    } else if (swipeDirection > 100 && index > 0) {
      index -= 1;
    } else {
      return;
    }
    section.removeChild(section.firstChild);
    const name = fileNames[index];
    const newImage = createImage(`/image/${name}`);
    section.appendChild(newImage);
    setHeader();
    setFooter(name);
  }

  function open(e) {
    const name = getFileName(e.target.src);
    const image = createImage(`/image/${name}`);
    app.classList.add("overflow-hidden");
    index = fileNames.indexOf(name);
    setHeader();
    setFooter(name);
    container.addEventListener("touchstart", setSwipe, { passive: true });
    container.addEventListener("touchend", setSwipe, { passive: true });
    section.appendChild(image);
    container.appendChild(header);
    container.appendChild(section);
    container.appendChild(footer);
    container.appendChild(cancelButton);
    app.appendChild(container);
  }
  container.setAttribute("class", "mask flex-col-between bg-black");
  cancelButton.setAttribute("class", "flex-col-center top-right text-white");
  cancelButton.innerHTML = feather.icons.x.toSvg({ class: "icon-x" });
  cancelButton.addEventListener("click", close);
  return { open };
})();

const DeletionPage = (() => {
  const app = Doc.getEl("app");
  const mainContent = Doc.getEl("fileContainer");
  const container = Doc.create("section");
  const btn = Doc.create("button");
  container.setAttribute(
    "class",
    "mask bg-black-trans events-none flex-col-end"
  );
  btn.setAttribute("class", "button--large events-fill");
  btn.setAttribute("data-active", "false");
  btn.textContent = "刪除";
  container.appendChild(btn);

  function open() {
    app.appendChild(container);
    btn.setAttribute("data-active", "true");
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
      Doc.getEl("app").addEventListener("click", open);
      return deleteFiles;
    } catch (err) {
      throw new Error(err);
    }
    cancelSelection();
  }

  btn.addEventListener("click", deleteFiles);

  return { open };
})();

export { ImageReader, DeletionPage };
