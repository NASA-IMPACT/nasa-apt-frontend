import { test, expect } from '../../playwright/fixtures';

test('owner requests review', async ({ ownerPage }) => {
  await ownerPage.gotoTestDocument('DRAFT');
  const { page } = ownerPage;

  const [request] = await Promise.all([
    page.waitForRequest('http://localhost:8888/v2/events'),
    page.getByRole('button', { name: ' Request review' }).click()
  ]);

  await expect(page.getByRole('alert')).toHaveText(
    'Review requested successfully'
  );
  await expect(JSON.parse(request.postData())).toEqual({
    atbd_id: 'test-atbd-1',
    version: 'v1.1',
    action: 'request_closed_review',
    payload: {}
  });
});

test('owner cannot request review if not draft', async ({ ownerPage }) => {
  const { page } = ownerPage;
  await ownerPage.gotoTestDocument();

  await expect(
    page.getByRole('button', { name: ' Request review' })
  ).not.toBeVisible();
});

test('curator cannot request review', async ({ curatorPage }) => {
  const { page } = curatorPage;
  await curatorPage.gotoTestDocument('DRAFT');

  await expect(
    page.getByRole('button', { name: ' Request review' })
  ).not.toBeVisible();
});

test('contributor cannot request review', async ({ contributorPage }) => {
  const { page } = contributorPage;
  await contributorPage.gotoTestDocument('DRAFT');

  await expect(
    page.getByRole('button', { name: ' Request review' })
  ).not.toBeVisible();
});

test('owner cancels review request', async ({ ownerPage }) => {
  const { page } = ownerPage;
  await ownerPage.gotoTestDocument('CLOSED_REVIEW_REQUESTED');

  const [request] = await Promise.all([
    page.waitForRequest('http://localhost:8888/v2/events'),
    page.getByRole('button', { name: ' Cancel request' }).click()
  ]);
  await expect(page.getByRole('alert')).toHaveText(
    'Review request cancelled successfully'
  );
  await expect(JSON.parse(request.postData())).toEqual({
    atbd_id: 'test-atbd-1',
    version: 'v1.1',
    action: 'cancel_closed_review_request',
    payload: {}
  });
});

test("owner can't cancel request if there is no request", async ({
  ownerPage
}) => {
  await ownerPage.gotoTestDocument('DRAFT');
  const { page } = ownerPage;
  await expect(
    page.getByRole('button', { name: ' Cancel request' })
  ).not.toBeVisible();
});

test('contributor cannot cancel request', async ({ contributorPage }) => {
  await contributorPage.gotoTestDocument('CLOSED_REVIEW_REQUESTED');

  await expect(
    contributorPage.page.getByRole('button', { name: ' Cancel request' })
  ).not.toBeVisible();
});

test('curator cannot cancel request', async ({ curatorPage }) => {
  await curatorPage.gotoTestDocument('CLOSED_REVIEW_REQUESTED');

  await expect(
    curatorPage.page.getByRole('button', { name: ' Cancel request' })
  ).not.toBeVisible();
});

test('curator approves request', async ({ curatorPage }) => {
  const { page } = curatorPage;
  await curatorPage.gotoTestDocument('CLOSED_REVIEW_REQUESTED');
  await page.getByRole('button', { name: 'Approve request ' }).click();
  await page.getByText('Allow...').click();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Ricardo Reviewer' })
    .locator('span')
    .nth(3)
    .click();

  const [request] = await Promise.all([
    page.waitForRequest('http://localhost:8888/v2/events'),
    page.getByRole('button', { name: ' Approve request' }).click()
  ]);
  await expect(page.getByRole('alert')).toHaveText(
    'Review request approved successfully'
  );
  await expect(JSON.parse(request.postData())).toEqual({
    atbd_id: 'test-atbd-1',
    version: 'v1.1',
    action: 'accept_closed_review_request',
    payload: {
      reviewers: ['6844a7fe-2bbd-4648-a9b4-5b1a6884038e']
    }
  });
});

test('curator denies request', async ({ curatorPage }) => {
  const { page } = curatorPage;
  await curatorPage.gotoTestDocument('CLOSED_REVIEW_REQUESTED');
  await page.getByRole('button', { name: 'Approve request ' }).click();

  await page.getByText('Deny...').click();
  await page.getByLabel('Write a comment (required)').click();
  await page.getByLabel('Write a comment (required)').fill('Not ready');
  const [request] = await Promise.all([
    page.waitForRequest('http://localhost:8888/v2/events'),
    page.getByRole('button', { name: ' Deny request' }).click()
  ]);
  await expect(page.getByRole('alert')).toHaveText(
    'Review request denied successfully'
  );
  await expect(JSON.parse(request.postData())).toEqual({
    atbd_id: 'test-atbd-1',
    version: 'v1.1',
    action: 'deny_closed_review_request',
    payload: {
      comment: 'Not ready'
    }
  });
});

test('owner cannot approve review request', async ({ ownerPage }) => {
  await ownerPage.gotoTestDocument('CLOSED_REVIEW_REQUESTED');

  await expect(
    ownerPage.page.getByRole('button', { name: 'Approve request ' })
  ).not.toBeVisible();
});

test('contributor cannot approve review request', async ({
  contributorPage
}) => {
  await contributorPage.gotoTestDocument('CLOSED_REVIEW_REQUESTED');

  await expect(
    contributorPage.page.getByRole('button', { name: 'Approve request ' })
  ).not.toBeVisible();
});

test('curator concludes review', async ({ curatorPage }) => {
  const { page } = curatorPage;

  await curatorPage.gotoTestDocument('CLOSED_REVIEW');
  await page.getByRole('button', { name: ' Conclude closed review' }).click();
  const [request] = await Promise.all([
    page.waitForRequest('http://localhost:8888/v2/events'),
    page.getByRole('button', { name: ' Confirm' }).click()
  ]);
  await expect(page.getByRole('alert')).toHaveText(
    'Review opened successfully'
  );

  await expect(JSON.parse(request.postData())).toEqual({
    atbd_id: 'test-atbd-1',
    version: 'v1.1',
    action: 'open_review',
    payload: {}
  });
});

test('owner cannot conclude review', async ({ ownerPage }) => {
  await ownerPage.gotoTestDocument('CLOSED_REVIEW');
  await expect(
    ownerPage.page.getByRole('button', { name: ' Conclude closed review' })
  ).not.toBeVisible();
});

test('contributor cannot conclude review', async ({ contributorPage }) => {
  await contributorPage.gotoTestDocument('CLOSED_REVIEW');
  await expect(
    contributorPage.page.getByRole('button', {
      name: ' Conclude closed review'
    })
  ).not.toBeVisible();
});

test('owner requests publication', async ({ ownerPage }) => {
  await ownerPage.gotoTestDocument('OPEN_REVIEW');
  const { page } = ownerPage;

  const [request] = await Promise.all([
    page.waitForRequest('http://localhost:8888/v2/events'),
    page.getByRole('button', { name: ' Request publication' }).click()
  ]);

  await expect(page.getByRole('alert')).toHaveText(
    'Publication requested successfully'
  );
  await expect(JSON.parse(request.postData())).toEqual({
    atbd_id: 'test-atbd-1',
    version: 'v1.1',
    action: 'request_publication',
    payload: {}
  });
});

test('owner cancels publication request', async ({ ownerPage }) => {
  const { page } = ownerPage;
  await ownerPage.gotoTestDocument('PUBLICATION_REQUESTED');

  const [request] = await Promise.all([
    page.waitForRequest('http://localhost:8888/v2/events'),
    page.getByRole('button', { name: ' Cancel request' }).click()
  ]);
  await expect(page.getByRole('alert')).toHaveText(
    'Publication request cancelled successfully'
  );
  await expect(JSON.parse(request.postData())).toEqual({
    atbd_id: 'test-atbd-1',
    version: 'v1.1',
    action: 'cancel_publication_request',
    payload: {}
  });
});

test('curator cannot request publication', async ({ curatorPage }) => {
  await curatorPage.gotoTestDocument('OPEN_REVIEW');
  await expect(
    curatorPage.page.getByRole('button', { name: ' Request publication' })
  ).not.toBeVisible();
});

test('contributor cannot request publication', async ({ contributorPage }) => {
  await contributorPage.gotoTestDocument('OPEN_REVIEW');
  await expect(
    contributorPage.page.getByRole('button', { name: ' Request publication' })
  ).not.toBeVisible();
});

test('curator can publish document', async ({ curatorPage }) => {
  await curatorPage.gotoTestDocument('PUBLICATION_REQUESTED');
  const { page } = curatorPage;

  await page.getByRole('button', { name: ' Publish' }).click();
  const [request] = await Promise.all([
    page.waitForRequest('http://localhost:8888/v2/events'),
    page.getByRole('button', { name: ' Publish' }).click()
  ]);
  await expect(page.getByRole('alert')).toHaveText(
    'Version v1.1 was published'
  );
  await expect(JSON.parse(request.postData())).toEqual({
    atbd_id: 'test-atbd-1',
    version: 'v1.1',
    action: 'publish',
    payload: {}
  });
});

test('curator can deny publication', async ({ curatorPage }) => {
  await curatorPage.gotoTestDocument('PUBLICATION_REQUESTED');
  const { page } = curatorPage;

  await page.getByRole('button', { name: ' Publish' }).click();
  await page.getByRole('button', { name: ' Cancel' }).click();
});

test('contributor cannot publish document', async ({ contributorPage }) => {
  await contributorPage.gotoTestDocument('PUBLICATION_REQUESTED');
  await expect(
    contributorPage.page.getByRole('button', { name: ' Publish' })
  ).not.toBeVisible();
});

test('owner cannot publish document', async ({ ownerPage }) => {
  await ownerPage.gotoTestDocument('PUBLICATION_REQUESTED');
  await expect(
    ownerPage.page.getByRole('button', { name: ' Publish' })
  ).not.toBeVisible();
});
