// TODO: del
console.log('load script')

function uploadFiles(url, fileSet) {
  const formData = new FormData();
  for (let i = 0; i < fileSet.length; i += 1) {
    formData.append('files', fileSet[i]);
  }
  try {
    return axios.post(url, formData);
  } catch(err) {
    throw new Error(err);
  }
}

async function getFileNames(url) {
  try {
    const response = await axios.get(url);
    const data = await response.data
    const fileNames = await data.map((item) => item.slice(0))
    return fileNames;
  } catch(err) {
    throw new Error(err);
  }
}

const createImage = (source) => {
  const container = document.createElement('div');
  const image = document.createElement('img');
  image.setAttribute('src', source);
  image.setAttribute('class', 'thumbnail');
  container.setAttribute('class', 'thumbnail-container');
  // control to show a little circle on bottom right for tick-on
  container.setAttribute('data-active', 'false');
  container.appendChild(image);
  return container;
}

async function handleFiles(fileRoot, isComressed = false) {
  // TODO: del
  console.log('run handle file');
  const indexRoot = fileRoot + 's';
  const fileNames = await getFileNames(indexRoot);
  const MainContent = document.getElementById('fileContainer');
  const type = isComressed ? fileRoot + '-xs' : fileRoot;
  while (MainContent.firstChild) {
    MainContent.removeChild(MainContent.lastChild);
  }
  fileNames.forEach((name) => {
      const source = `${type}/${name}`;
      // flexibility to extend depends on file type
      const item = createImage(source);
      MainContent.appendChild(item);
  });
  return fileNames.length;
}

async function initApp() {
  const filesRoot = '/image';
  const appTitleEl = document.getElementById('appTitle');
  try {
    const filesCount = await handleFiles(filesRoot, true);
    appTitleEl.textContent = await filesCount.toString().concat(appTitleEl.textContent.slice(2));
  } catch(err) {
    throw new Error(err);
  }
}

function setFileInputUploadEvent(e) {
  const url = '/upload';
  const fileSet = e.target.files;
  uploadFiles(url, fileSet).then(() => {
    initApp();
  });
}

function setItemChecked(e) {
  const container = e.target.closest('.thumbnail-container');
  const containerCheckedStatus = container.getAttribute('data-checked');
  if (containerCheckedStatus === null || containerCheckedStatus === 'false' ) {
    container.setAttribute('data-checked', 'true');
    const newSvg = document.createElement('div');
    newSvg.setAttribute('class', 'flex-col-center bottom-right');
    newSvg.innerHTML = feather.icons.check.toSvg({class: 'icon-check'});
    container.appendChild(newSvg);
  } else {
    container.setAttribute('data-checked', 'false');
    container.removeChild(container.lastChild);
  }
}

function setSelectFileEvent(e) {
  // if data-active === 'true' show the button;
  // if data-active === 'false' hide the button;
  e.target.setAttribute('data-active', 'false');
  const thumbnailContainer = document.querySelectorAll('.thumbnail-container');
  thumbnailContainer.forEach((item) => {
    if (item.getAttribute('data-active') === 'true') {
      console.log('wtf');
      item.setAttribute('data-active', 'false');
    } else {
      item.setAttribute('data-active', 'true');
    }
    item.addEventListener('click', setItemChecked);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // TODO: del
  console.log("load DOM content");
  // Having feather icon to replace <i> tags with its icons
  feather.replace();
  const fileInput = document.getElementById('fileInput');
  const selectionButton = document.getElementById('selectionButton');
  fileInput.addEventListener('change', setFileInputUploadEvent);
  selectionButton.addEventListener('click', setSelectFileEvent);
  initApp();
});