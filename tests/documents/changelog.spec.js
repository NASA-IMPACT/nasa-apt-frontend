import { test, expect } from '../../playwright/fixtures';

test('changelog renders', async ({ page }) => {
  await page.goto('/documents/test-atbd-1/v1.1');
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
