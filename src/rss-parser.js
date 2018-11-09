import Parser from 'rss-parser';

export default (feedXML) => {
  const parser = new Parser();

  const feedObject = parser.parseString(feedXML);

  return feedObject;
};
