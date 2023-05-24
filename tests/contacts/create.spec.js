const contactsList = require('../fixtures/server/contacts/list.json');
const contactsCreate = require('../fixtures/server/contacts/create.json');

import { test, expect } from '../../playwright/fixtures';

test('display contacts list', async ({ contributorPage: { page, login } }) => {
  await login();
  await page.route('http://localhost:8888/v2/contacts', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({ json: contactsCreate });
    } else {
      route.fulfill({ json: contactsList });
    }
  });

  await page.route('http://localhost:8888/v2/contacts/3', (route) => {
    route.fulfill({ json: contactsCreate });
  });

  await page.goto('http://localhost:9000/contacts');

  await expect(page).toHaveTitle('Contacts — Algorithm Publication Tool');
});
