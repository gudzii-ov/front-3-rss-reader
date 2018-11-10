import $ from 'jquery';

const getFeedElement = (feedObject) => {
  const { feedTitle, feedDescription, items: feedItems } = feedObject;

  const feedContainerElement = document.createElement('div');
  feedContainerElement.classList.add('container');

  const feedArticle = document.createElement('article');
  feedContainerElement.appendChild(feedArticle);

  const titleElement = document.createElement('h3');
  titleElement.textContent = feedTitle;

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = feedDescription;

  const itemsBlock = document.createElement('ul');
  itemsBlock.classList.add('list-group');

  const itemsKeys = Object.keys(feedItems);

  const itemsFragment = document.createDocumentFragment();
  itemsKeys.forEach((item) => {
    const {
      nodeTitle: itemTitle,
      nodeLink: itemLink,
    } = feedItems[item];

    console.log(itemTitle);
    console.log(itemLink);

    const itemLinkElement = document.createElement('a');
    itemLinkElement.setAttribute('href', itemLink);
    itemLinkElement.textContent = itemTitle;

    const itemElement = document.createElement('li');
    itemElement.classList.add('list-group-item');

    itemElement.appendChild(itemLinkElement);
    itemsFragment.appendChild(itemElement);
  });

  feedArticle.appendChild(titleElement);
  feedArticle.appendChild(descriptionElement);
  feedArticle.appendChild(itemsFragment);

  return feedContainerElement;
};

const showLoadingWindow = () => {
  const loaderElement = document.getElementById('loading-message');
  loaderElement.classList.remove('d-none');
};

const hideLoadingWindow = () => {
  const loaderElement = document.getElementById('loading-message');
  loaderElement.classList.add('d-none');
};

const showModal = (title, message) => {
  const modalElement = document.getElementById('modal-window');
  const modalTitle = modalElement.querySelector('.modal-title');
  const modalBody = modalElement.querySelector('.modal-body');
  modalTitle.textContent = title;
  modalBody.textContent = message;

  $('#modal-window').modal('show');
};

export default {
  getFeedElement, showLoadingWindow, hideLoadingWindow, showModal,
};
