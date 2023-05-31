// @ts-check
const { test, expect } = require('../playwright/fixtures');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:9000');

  await expect(page).toHaveTitle('Welcome — Algorithm Publication Tool');
});

test('get sign in page', async ({ page }) => {
  await page.goto('http://localhost:9000');

  await page.getByRole('link', { name: 'Sign in', exact: true }).click();

  await expect(page).toHaveURL(/.*signin/);
});

test('get ATBDs page', async ({ page }) => {
  await page.goto('http://localhost:9000');

  await page.getByRole('link', { name: 'ATBDs', exact: true }).click();

  await expect(page).toHaveURL(/.*documents/);
});

test('get About page', async ({ page }) => {
  await page.goto('http://localhost:9000');

  await page.getByRole('link', { name: 'About', exact: true }).click();

  await expect(page).toHaveURL(/.*about/);
});

test('get User Guide page', async ({ page }) => {
  await page.goto('http://localhost:9000');

  await page.getByRole('link', { name: 'User Guide', exact: true }).click();

  await expect(page).toHaveURL(/.*user-guide/);
});

test('get Feedback modal', async ({ page }) => {
  await page.goto('http://localhost:9000');

  await page.getByRole('button', { name: 'Feedback', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: 'Give us feedback' })
  ).toBeVisible();
  await page.getByRole('button', { name: ' Close' }).click();
});
