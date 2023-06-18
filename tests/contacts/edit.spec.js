import { test, expect } from '../../playwright/fixtures';

test.fixme('edit contacts', async ({ contributorPage: { page } }) => {
  await page.goto('http://localhost:9000/contacts/1/edit');

  await expect(page.getByLabel('First name (required)')).toHaveValue(
    'Leonardo'
  );
  await expect(page.getByLabel('Last name (required)')).toHaveValue('Davinci');

  await page.getByLabel('Url').fill('http://example.com');
  await page.getByRole('button', { name: ' Save' }).click();
  page.on('response', async (response) => {
    const json = await response.json();
    await expect(json).url.toBe('http://example.com');
    await expect(page.getByTitle('Contact Details')).toContainText(
      'http://example.com'
    );
    await expect(page.url()).toBe('http://localhost:9000/contacts/1');
  });
});

test.fixme('handles API error', async ({ contributorPage: { page } }) => {
  await page.goto('http://localhost:9000/contacts/1/edit');

  await expect(page.getByLabel('First name (required)')).toHaveValue(
    'Leonardo'
  );
  await expect(page.getByLabel('Last name (required)')).toHaveValue('Davinci');
  await page.getByLabel('Url').fill('http://example.com');

  await page.route('http://localhost:8888/v2/contacts/1', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 400,
        body: {
          detail: 'Error occurred'
        }
      });
    }
  });
  // Wait for response
  page.on('response', async (response) => {
    await expect(response.status()).toBe(400);
    await expect(page.getByRole('alert')).toContainText(
      'An error occurred: Error occurred'
    );
    await expect(page.url()).toBe('http://localhost:9000/contacts/1/edit');
  });
  await page.getByRole('button', { name: ' Save' }).click();
});
