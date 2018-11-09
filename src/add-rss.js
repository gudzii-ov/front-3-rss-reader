import validator from 'validator';
import WatchJS from 'melanke-watchjs';

const { watch } = WatchJS;

export default () => {
  const inputState = {
    isValid: null,
  };

  const appState = {
    feeds: [],
  };

  const inputField = document.getElementById('rss-reader-field');

  const validateText = (text) => {
    const isURL = validator.isURL(text);
    const isAdded = appState.feeds.includes(text);

    return isURL && !isAdded;
  };

  const inputHandler = (evt) => {
    const inputValue = evt.target.value;
    inputState.isValid = validateText(inputValue);
  };

  watch(inputState, 'isValid', () => {
    if (inputState.isValid) {
      inputField.style.outline = '3px solid green';
    } else {
      inputField.style.outline = '3px solid red';
    }
  });

  inputField.addEventListener('input', inputHandler);
};
