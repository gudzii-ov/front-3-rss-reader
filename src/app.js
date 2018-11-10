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
      title: '',
      description: '',
    },
    currentFeed: '',
  };

  const form = document.getElementById('rss-reader');
  const inputField = document.getElementById('rss-reader-field');
  const submitBtn = form.querySelector('button[type=submit]');

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

  const descriptionBtnClickHandler = (evt) => {
    const clickedBtnElement = evt.target;
    const feedLink = clickedBtnElement.getAttribute('data-feed-link');
    const itemDate = clickedBtnElement.getAttribute('data-item-date');
    const feedObject = appState.feedsLinks[feedLink];

    const itemTitle = feedObject.items[itemDate].nodeTitle;
    const itemDescription = feedObject.items[itemDate].nodeDescription;

    appState.descriptionBtn.title = itemTitle;
    appState.descriptionBtn.description = itemDescription;
    appState.descriptionBtn.clicked = true;
  };

  feedsBlock.addEventListener('click', descriptionBtnClickHandler);

  watch(appState, 'isInputValid', () => {
    if (appState.isInputValid) {
      inputField.classList.remove('border', 'border-danger');
    } else {
      inputField.classList.add('border', 'border-danger');
    }
  });

  watch(appState, 'feedLoading', () => {
    if (appState.feedLoading) {
      inputField.setAttribute('disabled', 'disabled');
      submitBtn.setAttribute('disabled', 'disabled');
      utils.showLoadingWindow();
    } else {
      inputField.removeAttribute('disabled');
      submitBtn.removeAttribute('disabled');
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
      const currentFeedLink = appState.currentFeed;
      const currentFeedObject = appState.feedsLinks[currentFeedLink];
      const feedElement = utils.getFeedElement(currentFeedLink, currentFeedObject);
      feedsBlock.appendChild(feedElement);
      inputField.value = '';
      appState.isInputValid = true;
      appState.parsingSuccess = false;
    }
  });

  watch(appState, 'descriptionBtn', () => {
    if (appState.descriptionBtn.clicked) {
      const { title, description } = appState.descriptionBtn;
      utils.showModal(title, description);
      appState.descriptionBtn.clicked = false;
    }
  });
};
