const contactsSingle = require('./server/contacts/single.json');
const contactsCreate = require('./server/contacts/create.json');
const contactsList = require('./server/contacts/list.json');

export const fixtureURLs = [
  {
    url: 'http://localhost:8888/v2/contacts/1',
    getResponse: contactsSingle,
    deleteResponse: {}
  },
  {
    url: 'http://localhost:8888/v2/contacts/2',
    deleteResponse: {}
  },
  {
    url: 'http://localhost:8888/v2/contacts/3',
    getResponse: contactsCreate
  },
  {
    url: 'http://localhost:8888/v2/contacts',
    getResponse: contactsList,
    postResponse: contactsCreate
  }
];

async function registerRoute(
  page,
  { url, getResponse, postResponse, deleteResponse }
) {
  await page.route(url, (route) => {
    if (postResponse && route.request().method() === 'POST') {
      return route.fulfill({ json: postResponse });
    } else if (deleteResponse && route.request().method() === 'DELETE') {
      return route.fulfill({ json: deleteResponse });
    } else {
      return route.fulfill({ json: getResponse });
    }
  });
}

export async function registerRoutes(page) {
  for (const fixture of fixtureURLs) {
    await registerRoute(page, fixture);
  }
}
