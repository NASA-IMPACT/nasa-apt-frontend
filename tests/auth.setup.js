import { test as setup } from '@playwright/test';
import { login } from '../playwright/auth-utils';

const ownerFile = 'playwright/.auth/owner.json';

setup('authenticate as owner', async ({ page }) => {
  await login('owner', page);
  await page.goto('http://localhost:9000/signin');

  await page.waitForURL('http://localhost:9000/');

  await page.context().storageState({ path: ownerFile });
});

const contributorFile = 'playwright/.auth/contributor.json';

setup('authenticate as contributor', async ({ page }) => {
  await login('contributor', page);
  await page.goto('http://localhost:9000/signin');
  await page.waitForURL('http://localhost:9000/');

  await page.context().storageState({ path: contributorFile });
});

const curatorFile = 'playwright/.auth/curator.json';

setup('authenticate as curator', async ({ page }) => {
  await login('curator', page);
  await page.goto('http://localhost:9000/signin');
  await page.waitForURL('http://localhost:9000/');

  await page.context().storageState({ path: curatorFile });
});
