import validator from 'validator';
import WatchJS from 'melanke-watchjs';
import axios from 'axios';
import rssParse from './rss-parser';
import utils from './utils';

const { watch } = WatchJS;

export default () => {
  const appState = {
    isInputValid: true,
    feedsLinks: {},
    feedLoading: false,
    parsingSuccess: false,
    processingError: false,
    processingErrorObj: {},
    descriptionBtn: {
      clicked: false,
      btnNode: null,
    },
    currentFeed: '',
  };

  const form = document.getElementById('rss-reader');
  const inputField = document.getElementById('rss-reader-field');
  const feedsBlock = document.querySelector('.feeds-list');
  const corsProxy = 'https://cors-proxy.htmldriven.com/?url=';

  const validateInput = (feedLink) => {
    const isInputEmpty = inputField.value === '';
    const isURL = validator.isURL(feedLink);
    const isAdded = Object.prototype.hasOwnProperty.call(appState.feedsLinks, feedLink);

    return (isURL && !isAdded) || isInputEmpty;
  };

  const inputHandler = (evt) => {
    const inputValue = evt.target.value;
    appState.isInputValid = validateInput(inputValue);
  };

  inputField.addEventListener('input', inputHandler);

  const submitFormHandler = (evt) => {
    if (appState.isInputValid) {
      const feedLink = inputField.value;
      appState.feedLoading = true;
      appState.isInputValid = null;

      axios.get(`${corsProxy}${feedLink}`)
        .then(
          (response) => {
            appState.feedLoading = false;
            return rssParse(response.data.body);
          },
          () => {
            appState.feedLoading = false;
            appState.processingError = true;
            appState.processingErrorObj = {
              title: 'Load Error',
              text: 'Failed to load feed. Maybe address unavailable',
            };
            throw new Error();
          },
        )
        .then(
          (feedObj) => {
            appState.currentFeed = feedLink;
            appState.feedsLinks[feedLink] = feedObj;
            appState.parsingSuccess = true;
          },
          () => {
            appState.processingError = true;
            appState.processingErrorObj = {
              title: 'Parsing Error',
              text: 'Failed to process feed. Wrong data. Try another feed address',
            };
          },
        );
    }
    evt.preventDefault();
  };

  form.addEventListener('submit', submitFormHandler);

  watch(appState, 'isInputValid', () => {
    if (appState.isInputValid) {
      inputField.classList.remove('border', 'border-danger');
    } else {
      inputField.classList.add('border', 'border-danger');
    }
  });

  watch(appState, 'feedLoading', () => {
    if (appState.feedLoading) {
      utils.showLoadingWindow();
    } else {
      utils.hideLoadingWindow();
    }
  });

  watch(appState, 'processingError', () => {
    if (appState.processingError) {
      const { title, text } = appState.processingErrorObj;
      utils.showModal(title, text);
      appState.processingError = false;
    }
  });

  watch(appState, 'parsingSuccess', () => {
    if (appState.parsingSuccess) {
      const feedElement = utils.getFeedElement(appState.feedsLinks[appState.currentFeed]);
      feedsBlock.appendChild(feedElement);
      inputField.value = '';
      appState.isInputValid = true;
      appState.parsingSuccess = false;
    }
  });
};
