export default (feedSource) => {
  const parser = new DOMParser();
  const feedDOM = parser.parseFromString(feedSource, 'application/xml');

  if (!feedDOM.querySelector('channel')) {
    throw new Error('Invalid feed source. Try another address');
  }

  const feedTitle = feedDOM.querySelector('channel title').textContent;
  const feedDescription = feedDOM.querySelector('channel description').textContent;

  const itemsNodes = feedDOM.querySelectorAll('item');
  const items = {};

  itemsNodes.forEach((node) => {
    const nodeTitle = node.querySelector('title').textContent;
    const nodeDescription = node.querySelector('description').textContent;
    const nodeLink = node.querySelector('link').textContent;
    const nodeDate = node.querySelector('pubDate').textContent;

    items[nodeDate] = { nodeTitle, nodeLink, nodeDescription };
  });

  return {
    feedTitle,
    feedDescription,
    items,
  };
};
