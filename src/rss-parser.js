export default (feedSource) => {
  const parser = new DOMParser();
  const feedDOM = parser.parseFromString(feedSource, 'application/xml');

  if (!feedDOM.querySelector('channel')) {
    throw new Error('Invalid feed source. Try another address');
  }

  console.log(feedDOM);
};
