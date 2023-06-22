import { test, expect } from '../../playwright/fixtures';

test('Displays ATBD to authorized user', async ({ contributorPage }) => {
  await contributorPage.gotoTestDocument();
  const { page } = contributorPage;

  await expect(page.locator('#doc-header')).toHaveText('Test ATBD 1');
  await expect(page.locator('#abstract + div')).toHaveText(
    /A brief and interesting overview of the themes presented in this document are as follows/
  );
  await expect(page.locator('#plain_summary + div')).toHaveText(
    /A brief and interesting overview of the themse presented in this document, but this time, without jargon/
  );
});

test('Shows error page to anonymous user', async ({ page }) => {
  await page.goto('/documents/test-atbd-1/v1.1');
  await expect(
    page.getByRole('heading', { name: 'Page not found' })
  ).toBeVisible();
});

test('Shows error page to unauthorized user', async ({ contributorPage }) => {
  const { page } = contributorPage;
  page.route('http://localhost:8888/v2/atbds/test-atbd-1', (route) => {
    route.fulfill({
      status: 404,
      json: { detail: 'No atbds found' }
    });
  });
  page.route(
    'http://localhost:8888/v2/atbds/test-atbd-1/versions/v1.1',
    (route) => {
      route.fulfill({
        status: 403,
        json: { detail: 'View for ATBD Version is not allowed' }
      });
    }
  );

  await page.goto('/documents/test-atbd-1/v1.1');

  await expect(
    page.getByRole('heading', { name: 'Page not found' })
  ).toBeVisible();
});
