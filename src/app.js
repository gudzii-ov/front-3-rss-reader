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
    descriptionBtn: {
      clicked: false,
      btnNode: null,
    },
  };

  const form = document.getElementById('rss-reader');
  const inputField = document.getElementById('rss-reader-field');
  const feedsBlock = document.querySelector('.feeds-list');
  const corsProxy = 'https://cors-proxy.htmldriven.com/?url=';

  const validateInput = (feedLink) => {
    const isURL = validator.isURL(feedLink);
    const isAdded = appState.feedsLinks.includes(feedLink);

    return isURL && !isAdded;
  };

  const inputHandler = (evt) => {
    const inputValue = evt.target.value;
    appState.isInputValid = validateInput(inputValue);
  };

  inputField.addEventListener('input', inputHandler);

  const submitFormHandler = (evt) => {
    if (appState.isInputValid) {
      const feedLink = inputField.value;
      appState.isLoadingFeed = true;
      appState.isInputValid = null;

      axios.get(`${corsProxy}${feedLink}`)
        .then(response => rssParse(response.data.body))
        .catch((err) => {
          utils.showModal('Error', err.message);
        })
        .then((feedObj) => {
          appState.isLoadingFeed = false;
          appState.feedsLinks.push(feedLink);
          console.log(appState.feedsLinks);
          inputField.value = '';
          const feedElement = utils.getFeedElement(feedObj);
          feedsBlock.appendChild(feedElement);
        });
    }
    evt.preventDefault();
  };

  form.addEventListener('submit', submitFormHandler);

  watch(appState, 'isInputValid', () => {
    if (appState.isInputValid === null) {
      inputField.style.outline = 'none';
    } else if (appState.isInputValid) {
      inputField.classList.remove('border', 'border-danger');
    } else {
      inputField.classList.add('border', 'border-danger');
    }
  });

  watch(appState, 'isLoadingFeed', () => {
    if (appState.isLoadingFeed) {
      utils.showLoadingWindow();
    } else {
      utils.hideLoadingWindow();
    }
  });
};
