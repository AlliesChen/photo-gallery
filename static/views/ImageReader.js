import FileHandler, {
  Doc,
  createImage,
  getFileName,
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
    if (e.target.nodeName !== "IMG") return;
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

export { ImageReader };
