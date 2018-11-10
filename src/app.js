import validator from 'validator';
import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import rssParse from './rss-parser';
import utils from './utils';

const { watch } = WatchJS;

export default () => {
  const appState = {
    isInputValid: null,
    feedsLinks: {},
    feedProcessing: 'pending',
    descriptionBtn: {
      clicked: false,
      btnNode: null,
    },
    currentFeedObj: {},
  };

  const form = document.getElementById('rss-reader');
  const inputField = document.getElementById('rss-reader-field');
  const feedsBlock = document.querySelector('.feeds-list');
  const corsProxy = 'https://cors-proxy.htmldriven.com/?url=';

  const validateInput = (feedLink) => {
    const isURL = validator.isURL(feedLink);
    const isAdded = Object.prototype.hasOwnProperty.call(appState.feedsLinks, feedLink);

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
      appState.feedProcessing = 'loading';
      appState.isInputValid = null;

      axios.get(`${corsProxy}${feedLink}`)
        .then(
          (response) => {
            appState.feedProcessing = 'load-success';
            rssParse(response.data.body);
          },
          () => {
            appState.feedProcessing = 'load-error';
          },
        )
        .then(
          (feedObj) => {
            appState.feedsLinks[feedLink] = feedObj;
            appState.currentFeed = feedLink;
            appState.feedProcessing = 'parsing-success';
            appState.feedProcessing = 'pending';
          },
          () => {
            appState.feedProcessing = 'parse-error';
          },
        );
    }
    evt.preventDefault();
  };

  form.addEventListener('submit', submitFormHandler);

  watch(appState, 'isInputValid', () => {
    console.log(`validator check: ${appState.isInputValid}`);
    if (appState.isInputValid) {
      inputField.classList.remove('border', 'border-danger');
    } else {
      inputField.classList.add('border', 'border-danger');
    }
  });

  watch(appState, 'feedProcessing', () => {
    const currentState = appState.feedProcessing;
    console.log(`app state: ${currentState}`);
    switch (currentState) {
      case 'loading':
        utils.showLoadingWindow();
        break;
      case 'load-success':
        utils.hideLoadingWindow();
        break;
      case 'load-error':
        utils.hideLoadingWindow();
        utils.showModal('Load Error', 'Failed to load feed. Maybe wrong address');
        break;
      case 'parsing-success':
        feedsBlock.appendChild(utils.getFeedElement(appState.currentFeedObj));
        break;
      case 'parse-error':
        utils.showModal('Process Error', 'Failed to process feed. Wrong data');
        break;
      case 'pending':
        inputField.value = '';
        break;
      default:
        break;
    }
  });
};
