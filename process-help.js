#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const MarkdownIt = require('markdown-it');
const yamlFront = require('yaml-front-matter');

const mdRenderer = new MarkdownIt({ html: true });

async function main() {
  const docs = path.join(__dirname, 'help-documentation');
  const docsDir = await fs.readdir(docs);
  const mdDocs = docsDir.filter((f) => {
    const extension = path.extname(f).toLowerCase();
    return extension === '.md';
  });

  await fs.ensureDir(path.join(__dirname, 'public/docs'));
  await fs.emptyDir(path.join(__dirname, 'public/docs'));

  /* eslint-disable-next-line prefer-const */
  let pageIndex = [];
  mdDocs.forEach((f) => {
    const id = path.basename(f, '.md');

    try {
      const mdContent = fs.readFileSync(path.join(docs, f), 'utf8');
      const data = yamlFront.loadFront(mdContent);
      const rendered = mdRenderer.render(data.__content);
      fs.writeFileSync(
        path.join(__dirname, `public/docs/${id}.json`),
        JSON.stringify({ title: data.title, content: rendered })
      );
      pageIndex.push({
        id,
        title: data.title,
        url: `/docs/${id}.json`,
      });
    } catch (e) {
      console.log(e);
      console.log(`Could not process ${f}, skipping`);
    }
  });

  await fs.writeJSON(
    path.join(__dirname, 'public/docs/index.json'),
    pageIndex
  );
}

main().then(console.log).catch(console.log);
