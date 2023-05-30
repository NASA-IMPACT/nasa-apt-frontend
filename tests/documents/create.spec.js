import { test, expect } from '../../playwright/fixtures';

test('create document', async ({ contributorPage: { page } }) => {
  await page.goto('http://localhost:9000/dashboard');
  await page.getByRole('button', { name: ' Create' }).click();
  await page.getByRole('button', { name: ' Understood' }).click();

  await expect(page.getByLabel('ATBD Title')).toHaveValue('Untitled Document');
});
