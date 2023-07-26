import { test, expect } from '../../playwright/fixtures';

test('changelog renders', async ({ contributorPage }) => {
  await contributorPage.gotoTestDocument();
  const { page } = contributorPage;
  await expect(page.locator('#doc-header')).toHaveText(/Test ATBD 1/);
  await page.getByRole('button', { name: ' Document options' }).click();
  await page.getByText('View changelog...').click();
  await expect(
    page.getByRole('heading', { name: 'Major version 1' })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Major version 2' })
  ).toBeVisible();
});
