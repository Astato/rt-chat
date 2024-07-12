const { JSDOM } = require("jsdom");
const createDomPurify = require("dompurify");

const window = new JSDOM("").window;
const DOMPurify = createDomPurify(window);

function purify(text) {
  const clean = DOMPurify.sanitize(text);
  return clean;
}

module.exports = purify;
