import validator from 'validator';
import WatchJS from 'melanke-watchjs';

const { watch } = WatchJS;

export default () => {
  const appState = {
    isInputValid: null,
    feedsLinks: [],
  };

  const form = document.getElementById('rss-reader');
  const inputField = document.getElementById('rss-reader-field');

  const validateText = (text) => {
    const isURL = validator.isURL(text);
    const isAdded = appState.feedsLinks.includes(text);

    return isURL && !isAdded;
  };

  const inputHandler = (evt) => {
    const inputValue = evt.target.value;
    appState.isInputValid = validateText(inputValue);
  };

  const submitFormHandler = (evt) => {
    if (appState.isInputValid) {
      appState.feedsLinks.push(inputField.value);
      inputField.value = '';
      appState.isInputValid = null;
    }
    evt.preventDefault();
  };

  watch(appState, 'isInputValid', () => {
    if (appState.isInputValid === null) {
      inputField.style.outline = 'none';
    } else if (appState.isInputValid) {
      inputField.style.outline = '3px solid green';
    } else {
      inputField.style.outline = '3px solid red';
    }
  });

  inputField.addEventListener('input', inputHandler);
  form.addEventListener('submit', submitFormHandler);
};
