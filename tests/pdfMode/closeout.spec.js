import { test, expect } from '../../playwright/fixtures';
import { JOURNAL_PUB_INTENDED } from '../../app/assets/scripts/components/documents/status';
test.describe('pdf closeout', () => {
  test.beforeEach(async ({ ownerPage: { page } }) => {
    await page.goto(
      'http://localhost:9000/documents/227/v1.0/edit/pdf-closeout'
    );
  });

  test('form shape', async ({ ownerPage: { page } }) => {
    await expect(page.locator('#abstract')).toBeVisible();
    await expect(page.locator('#plain_summary')).toBeVisible();

    await expect(page.getByText('Keywords')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Journal details' })
    ).toBeVisible();
  });

  test('change journal details', async ({ ownerPage: { page } }) => {
    await page
      .locator('label')
      .filter({ hasText: /^To be published$/ })
      .locator('span')
      .first()
      .click();

    const [request] = await Promise.all([
      page.waitForRequest((response) => {
        return response.url().includes('/v2/atbds/227/versions/v1.0');
      }),
      page.getByRole('button', { name: ' Save & view' }).click()
    ]);
    await expect(page.getByRole('alert')).toHaveText('Changes saved');

    const requestBody = JSON.parse(request.postData());
    await expect(requestBody.journal_status).toEqual(JOURNAL_PUB_INTENDED);
  });
});
