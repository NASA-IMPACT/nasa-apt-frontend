import { test, expect } from '../../playwright/fixtures';
import atbdVersions from '../../playwright/fixtures/server/atbd-versions.json';

test('owner requests review', async ({ ownerPage }) => {
  await ownerPage.gotoTestDocument();
  const { page } = ownerPage;

  const requestReviewRqPromise = page.waitForResponse(
    'http://localhost:8888/v2/events'
  );
  await page.getByRole('button', { name: ' Request review' }).click();

  await expect(page.getByRole('alert')).toHaveText(
    'Review requested successfully'
  );
  const requestReviewResponse = await requestReviewRqPromise;
  await requestReviewResponse.json();
  await expect(requestReviewResponse.status()).toBe(200);
});

test('owner cannot request review if not draft', async ({ ownerPage }) => {
  const { page } = ownerPage;
  page.route(
    'http://localhost:8888/v2/atbds/test-atbd-1/versions/v1.1',
    (route) => {
      return route.fulfill({ json: atbdVersions });
    }
  );

  await ownerPage.gotoTestDocument();

  await expect(
    page.getByRole('button', { name: ' Request review' })
  ).not.toBeVisible();
});
