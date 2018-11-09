const getFeedElement = (feedObject) => {
  const feedContainerElement = document.createElement('div');
  feedContainerElement.classList.add('container');

  const feedArticle = document.createElement('article');
  feedContainerElement.appendChild(feedArticle);

  const feedTitle = feedObject.title;
  const feedDescription = feedObject.description;
  const feedItems = feedObject.items;

  const titleElement = document.createElement('h3');
  titleElement.textContent = feedTitle;

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = feedDescription;

  const itemsBlock = document.createElement('ul');
  itemsBlock.classList.add('list-group');

  const itemsFragment = document.createDocumentFragment();

  feedItems.forEach((item) => {
    const itemTitle = item.title;
    const itemLink = item.link;

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

export default { getFeedElement };
