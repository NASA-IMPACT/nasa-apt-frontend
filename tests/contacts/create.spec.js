import { test, expect } from '../../playwright/fixtures';

test('create a contact', async ({ contributorPage: { page } }) => {
  await page.goto('http://localhost:9000/contacts');

  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page).toHaveURL('http://localhost:9000/contacts/3/edit');

  await expect(page.getByLabel('First name (required)')).toHaveValue('New');
  await expect(page.getByLabel('Last name (required)')).toHaveValue('Contact');

  await expect(page).toHaveTitle(
    'Editing New Contact — Algorithm Publication Tool'
  );
});
