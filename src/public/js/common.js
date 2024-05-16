const injectHTML = (elementId, content) => {
  document.getElementById(elementId).innerHTML = content;
};

const injectImgSrc = (elementId, src) => {
  document.getElementById(elementId).src = src;
};

const replaceLocation = (URL) => {
  window.location.href = URL;
};

const openLocation = (URL) => {
  window.open(URL, '_blank');
};

const setLocalStorage = (tag, data) => {
  localStorage.setItem(tag, JSON.stringify(data));
};

const getLocalStorage = (tag) => {
  return localStorage.getItem(tag);
};

const removeLocalStorage = (tag) => {
  localStorage.removeItem(tag);
};

const displayComponent = (elementId) => {
  document.getElementById(elementId).style.display = 'flex';
};

const hideComponent = (elementId) => {
  document.getElementById(elementId).style.display = 'none';
};

const setComponentBackgroundColor = (elementId, color) => {
  document.getElementById(elementId).style.backgroundColor = color;
};

const setComponentWidth = (elementId, maxWidth) => {
  document.getElementById(elementId).style.width = maxWidth;
};

const setComponentFontSize = (elementId, fontSize) => {
  document.getElementById(elementId).style.fontSize = fontSize;
};
