import validator from 'validator';
import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import rssParse from './rss-parser';
import utils from './utils';

const { watch } = WatchJS;

export default () => {
  const appState = {
    isInputValid: null,
    feedsLinks: [],
    isLoadingFeed: false,
  };

  const form = document.getElementById('rss-reader');
  const inputField = document.getElementById('rss-reader-field');
  const feedsBlock = document.querySelector('.feeds-list');

  const validateInput = (inputText) => {
    const isURL = validator.isURL(inputText);
    const isAdded = appState.feedsLinks.includes(inputText);
    console.log(isAdded);

    return isURL && !isAdded;
  };

  const inputHandler = (evt) => {
    const inputValue = evt.target.value;
    appState.isInputValid = validateInput(inputValue);
  };

  const submitFormHandler = (evt) => {
    if (appState.isInputValid) {
      const corsProxy = 'https://cors-proxy.htmldriven.com/?url=';
      const newFeedAddress = `${corsProxy}${inputField.value}`;
      appState.feedsLinks.push(inputField.value);
      inputField.value = '';
      appState.isInputValid = null;

      appState.isLoadingFeed = true;
      axios.get(newFeedAddress)
        .then(response => rssParse(response.data.body))
        .catch(err => console.log(err.message))
        .then((feedObj) => {
          appState.isLoadingFeed = false;
          const feedElement = utils.getFeedElement(feedObj);
          feedsBlock.appendChild(feedElement);
        });
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

  watch(appState, 'isLoadingFeed', () => {
    if (appState.isLoadingFeed) {
      console.log('loading...');
    } else {
      console.log('loading done');
    }
  });

  inputField.addEventListener('input', inputHandler);
  form.addEventListener('submit', submitFormHandler);
};
