import { test, expect } from '../../playwright/fixtures';

test('deletes from detail page', async ({ contributorPage: { page } }) => {
  await page.goto('http://localhost:9000/contacts/1');

  await page.getByRole('button', { name: ' Contact options' }).click();
  await page.getByText('Delete').click();
  await page.getByRole('button', { name: ' Delete' }).click();

  await expect(page).toHaveURL('http://localhost:9000/contacts');

  await expect(page.getByRole('alert')).toHaveText(
    'Contact successfully deleted'
  );
});

test('deletes from list page', async ({ contributorPage: { page } }) => {
  await page.goto('http://localhost:9000/contacts');

  await page
    .getByRole('listitem')
    .filter({
      hasText: 'Gregor Mendel'
    })
    .getByRole('button', { name: ' Contact options' })
    .click();

  await page.getByText('Delete').click();
  await page.getByRole('button', { name: ' Delete' }).click();

  await expect(page).toHaveURL('http://localhost:9000/contacts');

  await expect(page.locator('ol')).not.toHaveText('Gregor Mendel');

  await expect(page.getByRole('alert')).toHaveText(
    'Contact successfully deleted'
  );
});
