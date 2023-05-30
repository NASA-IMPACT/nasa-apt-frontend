import { test, expect } from '../../playwright/fixtures';
import atbdVersions from '../../playwright/fixtures/server/atbd-versions.json';

test('owner requests review', async ({ ownerPage: { page } }) => {
  const statsRqPromise = page.waitForResponse(
    'http://localhost:8888/v2/threads/stats?atbds=1_v1.1'
  );
  const atbdRqPromise = page.waitForResponse(
    'http://localhost:8888/v2/atbds/test-atbd-1'
  );
  const versionRqPromise = page.waitForResponse(
    'http://localhost:8888/v2/atbds/test-atbd-1/versions/v1.1'
  );

  await Promise.all([
    page.goto('http://localhost:9000/documents/test-atbd-1/v1.1'),
    statsRqPromise,
    atbdRqPromise,
    versionRqPromise
  ]);

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

test('owner cannot request review if not draft', async ({
  ownerPage: { page }
}) => {
  page.route(
    'http://localhost:8888/v2/atbds/test-atbd-1/versions/v1.1',
    (route) => {
      return route.fulfill({ json: atbdVersions });
    }
  );
  const statsRqPromise = page.waitForResponse(
    'http://localhost:8888/v2/threads/stats?atbds=1_v1.1'
  );
  const atbdRqPromise = page.waitForResponse(
    'http://localhost:8888/v2/atbds/test-atbd-1'
  );
  const versionRqPromise = page.waitForResponse(
    'http://localhost:8888/v2/atbds/test-atbd-1/versions/v1.1'
  );

  await Promise.all([
    page.goto('http://localhost:9000/documents/test-atbd-1/v1.1'),
    statsRqPromise,
    atbdRqPromise,
    versionRqPromise
  ]);

  await expect(
    page.getByRole('button', { name: ' Request review' })
  ).not.toBeVisible();
});
