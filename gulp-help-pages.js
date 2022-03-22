const path = require('path');
const through2 = require('through2');
const MarkdownIt = require('markdown-it');
const MarkdownTOC = require('markdown-it-table-of-contents');
const MarkdownAnchors = require('markdown-it-anchor');
const yamlFront = require('yaml-front-matter');
const Vinyl = require('vinyl');

const mdRenderer = new MarkdownIt({ html: true }).use(markdownFigure);
mdRenderer.use(MarkdownTOC, { includeLevel: [2, 3] });
mdRenderer.use(MarkdownAnchors);

function processHelpPages(basePath) {
  let pageIndex = [];

  function transform(file, enc, cb) {
    const id = path.basename(file.path, '.md');
    const mdContent = file.contents.toString();

    const data = yamlFront.loadFront(mdContent);
    const rendered = mdRenderer.render(data.__content);
    file.contents = Buffer.from(
      JSON.stringify({ title: data.title, content: rendered })
    );
    file.path = file.path.replace(/\.md$/, '.json');
    this.push(file);

    pageIndex.push({
      id,
      title: data.title,
      url: path.join(basePath, `${id}.json`)
    });

    cb();
  }

  function flush(cb) {
    const indexFile = new Vinyl({
      cwd: __dirname,
      base: path.join(__dirname, 'content/help-documentation'),
      path: path.join(__dirname, 'content/help-documentation/index.json'),
      contents: Buffer.from(JSON.stringify(pageIndex))
    });
    cb(null, indexFile);
  }

  return through2.obj(transform, flush);
}

module.exports = processHelpPages;

function markdownFigure(md) {
  md.renderer.rules.image = function (tokens, idx) {
    const token = tokens[idx];
    const alt = token.content;
    const [, url] = token.attrs[token.attrIndex('src')] || [];
    const [, caption] = token.attrs[token.attrIndex('title')] || [];

    return `
<figure>
  <img src="${url}" ${!!alt && `alt="${alt}"`} />
  ${!!caption && `<figcaption>${caption}</figcaption>`}
</figure>`;
  };
}
