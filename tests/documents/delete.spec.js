import { test, expect } from '../../playwright/fixtures';

test('delete button not disabled for owner', async ({ ownerPage }) => {
  // Delete button shows up only for draft documents.
  // Delete button shows up when the user is the creator of the document.

  await ownerPage.gotoTestDocument('DRAFT');
  let { page } = ownerPage;
  await page.getByRole('button', { name: ' Document options' }).click();
  await expect(page.getByText('Delete')).not.toHaveAttribute('disabled', '');
  await page.getByText('Delete').click();
  await expect(
    page.getByText('The version v1.1 of document Test ATBD 1 will be deleted.')
  ).toBeVisible();
});

test('delete button not disabled for curator', async ({ curatorPage }) => {
  // Delete button shows up only for draft documents.
  // Delete button shows up when the user is the curator

  await curatorPage.gotoTestDocument('DRAFT');
  let { page } = curatorPage;
  await page.getByRole('button', { name: ' Document options' }).click();
  await expect(page.getByText('Delete')).not.toHaveAttribute('disabled', '');
  await page.getByText('Delete').click();
  await expect(
    page.getByText('The version v1.1 of document Test ATBD 1 will be deleted.')
  ).toBeVisible();
});

test('different text for new document', async ({ ownerPage }) => {
  let { page } = ownerPage;
  await ownerPage.gotoNewDocument();
  await page.getByRole('button', { name: ' Document options' }).click();
  await expect(page.getByText('Delete')).not.toHaveAttribute('disabled', '');
  await page.getByText('Delete').click();
  await expect(
    page.getByText(
      'The document Untitled Document will be permanently deleted. Do you want to proceed?'
    )
  ).toBeVisible();
});

test('delete button disabled for owner', async ({ ownerPage }) => {
  // Delete button shows up only for draft documents.
  // Delete button shows up when the user is the creator of the document.

  await ownerPage.gotoTestDocument();
  let { page } = ownerPage;
  await page.getByRole('button', { name: ' Document options' }).click();
  await expect(page.getByTitle('Delete document')).toHaveAttribute(
    'disabled',
    ''
  );
});

test('delete button disabled for curator', async ({ curatorPage }) => {
  // Delete button shows up only for draft documents.
  // Delete button shows up when the user is the creator of the document.

  await curatorPage.gotoTestDocument();
  let { page } = curatorPage;
  await page.getByRole('button', { name: ' Document options' }).click();
  await expect(page.getByTitle('Delete document')).toHaveAttribute(
    'disabled',
    ''
  );
});

test('delete button does not show for non-owner contributor', async ({
  contributorPage
}) => {
  await contributorPage.gotoTestDocument('DRAFT');
  let { page } = contributorPage;
  await page.getByRole('button', { name: ' Document options' }).click();
});
