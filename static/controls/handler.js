export const Doc = (() => {
  function create(el) {
    return document.createElement(el);
  }

  function getEl(id) {
    return document.getElementById(id);
  }

  function query(selector) {
    return document.querySelector(selector);
  }

  function queryAll(selector) {
    return document.querySelectorAll(selector);
  }
  return { create, getEl, query, queryAll };
})();

export function uploadFiles(url, fileSet) {
  const formData = new FormData();
  for (let i = 0; i < fileSet.length; i += 1) {
    formData.append("files", fileSet[i]);
  }
  try {
    return axios.post(url, formData);
  } catch (err) {
    throw new Error(err);
  }
}

export function getFileName(url) {
  return url.match(/\d+.(?:jpe?g|png)$/).toString();
}

export async function getFileNames(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    // in case no file exists
    if (!data) {
      return [];
    }
    const fileNames = data.map((item) => item.slice(0));
    return fileNames;
  } catch (err) {
    throw new Error(err);
  }
}

export function toggleFooter() {
  const footer = Doc.query("footer.app--footer");
  for (let i = 0; i < footer.children.length; i += 1) {
    footer.children[i].classList.toggle("none");
  }
}

export function createImage(source) {
  const image = document.createElement("img");
  image.setAttribute("src", source);
  image.setAttribute("class", "w-100");
  return image;
}

export function setThumbnails(sources) {
  const imgEls = sources.map((name) => {
    const img = createImage(`/image-xs/${name}`);
    const container = Doc.create("div");
    container.setAttribute("class", "thumbnail-container");
    // control to show a little circle on bottom right for tick-on
    container.setAttribute("data-active", "false");
    container.appendChild(img);
    return container;
  });
  return imgEls;
}

export function setItemChecked(e) {
  if (e.target.nodeName !== "IMG") return;
  const container = e.target.closest(".thumbnail-container");
  const selectedCount = Doc.getEl("selectedCount");
  const deletionBtn = Doc.getEl("deletionButton");
  let counter = parseInt(selectedCount.textContent);
  const containerCheckedStatus = container.getAttribute("data-checked");
  if (containerCheckedStatus === null || containerCheckedStatus === "false") {
    container.setAttribute("data-checked", "true");
    const newSvg = Doc.create("div");
    newSvg.setAttribute("class", "flex-col-center bottom-right");
    newSvg.setAttribute("data-temp", "true");
    newSvg.innerHTML = feather.icons.check.toSvg({ class: "icon-check" });
    container.appendChild(newSvg);
    counter += 1;
  } else {
    container.setAttribute("data-checked", "false");
    container.removeChild(container.lastChild);
    counter -= 1;
  }
  selectedCount.textContent = counter;

  if (counter && deletionBtn.getAttribute("disabled")) {
    deletionBtn.removeAttribute("disabled");
  } else if (counter === 0) {
    deletionBtn.setAttribute("disabled", "true");
  }
}

export function cancelSelection() {
  const thumbnailContainer = Doc.queryAll(".thumbnail-container");
  thumbnailContainer.forEach((item) => {
    if (item.matches("[data-checked='true']")) {
      // remove the svg container(check icon)
      item.removeChild(item.lastChild);
    }
    item.setAttribute("data-checked", "false");
    item.setAttribute("data-active", "false");
  });
  Doc.getEl("fileContainer").removeEventListener("click", setItemChecked);
}

const FileHandler = (async () => {
  const imgNames = [];
  const vidNames = [];
  try {
    const imgResponse = await getFileNames("/images");
    imgNames.push(...imgResponse);
    const videoResponse = await getFileNames("/videos");
    vidNames.push(...videoResponse);
  } catch (err) {
    throw new Error(err);
  }

  return { imgNames, vidNames };
})();

export default FileHandler;

export async function setAppTitle() {
  const appTitleEl = Doc.getEl("appTitle");
  const counter = (await FileHandler).imgNames.length;
  appTitleEl.textContent = counter.toString().concat("張照片");
}
