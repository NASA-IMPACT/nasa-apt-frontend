// playwright/fixtures.ts
import { test as base, Page } from '@playwright/test';
import {
  registerAnonymousRoutes,
  registerAuthenticatedRoutes,
  versionWithStatus
} from './fixtures/register';
import { login } from './auth-utils';
import atbdVersions from './fixtures/server/atbd-versions.json';

/**
 * Initializes the ATBD page with the given status
 * and waits for the page to load
 *
 * @param page
 * @param status - ATBD status
 */
async function gotoTestDocument(page, status) {
  if (status && status !== 'PUBLISHED') {
    page.route(
      'http://localhost:8888/v2/atbds/test-atbd-1/versions/v1.1',
      (route) => {
        return route.fulfill({ json: versionWithStatus(atbdVersions, status) });
      }
    );
  }
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
}

/**
 * Represents a logged in page with a given role
 *
 * The init method will login the user with the role and register which routes
 * will be intercepted and given a mock response
 * */
class LoggedInPage {
  page: Page;
  role: string;

  async login() {
    await login(this.role, this.page);
  }

  async routes() {
    await registerAuthenticatedRoutes(this.page);
  }

  async gotoTestDocument(status) {
    return gotoTestDocument(this.page, status);
  }

  async init() {
    await this.login();
    await this.routes();
  }

  constructor(page: Page, role: string) {
    this.page = page;
    this.role = role;
    this.login = this.login.bind(this);
    this.routes = this.routes.bind(this);
    this.gotoTestDocument = this.gotoTestDocument.bind(this);
  }
}

type Fixtures = {
  ownerPage: LoggedInPage;
  contributorPage: LoggedInPage;
  curatorPage: LoggedInPage;
};

/**
 * Extends the base test fixture with the following:
 * - page: a page with no role
 * - ownerPage: a page with the owner role
 * - contributorPage: a page with the contributor role
 * - curatorPage: a page with the curator role
 *
 * For each fixture, the browser is initialized with local storage
 * that is read from a "state" file in the playwright/.auth directory
 *
 * The state file is created at setup time by "setup" in auth.setup.js
 */
export * from '@playwright/test';
export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    registerAnonymousRoutes(page);
    await use(page);
  },
  ownerPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/owner.json'
    });
    const ownerPage = new LoggedInPage(await context.newPage(), 'owner');
    await ownerPage.init();
    await use(ownerPage);
  },
  contributorPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/contributor.json'
    });
    const contributorPage = new LoggedInPage(
      await context.newPage(),
      'contributor'
    );
    await contributorPage.init();
    await use(contributorPage);
  },
  curatorPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/curator.json'
    });
    const curatorPage = new LoggedInPage(await context.newPage(), 'curator');
    await curatorPage.init();
    await use(curatorPage);
  }
});
