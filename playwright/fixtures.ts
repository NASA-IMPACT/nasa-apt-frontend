// playwright/fixtures.ts
import { test as base, Page } from '@playwright/test';
import { registerRoutes } from './fixtures/register';
import { login } from './auth-utils';

// Page Object Model for the "owner" page.
// Here you can add locators and helper methods specific to the admin page.
class OwnerPage {
  // Page signed in as "admin".
  page: Page;

  async login() {
    await login('owner', this.page);
  }

  async routes() {
    await registerRoutes(this.page);
  }

  async init() {
    await this.login();
    await this.routes();
  }

  constructor(page: Page) {
    this.page = page;
    this.login = this.login.bind(this);
    this.routes = this.routes.bind(this);
  }
}

// Page Object Model for the "contributor" page.
// Here you can add locators and helper methods specific to the user page.
class ContributorPage {
  // Page signed in as "user".
  page: Page;

  async login() {
    await login('contributor', this.page);
  }

  async routes() {
    await registerRoutes(this.page);
  }

  async init() {
    await this.login();
    await this.routes();
  }

  constructor(page: Page) {
    this.page = page;
    this.login = this.login.bind(this);
    this.routes = this.routes.bind(this);
  }
}

// Page Object Model for the "user" page.
// Here you can add locators and helper methods specific to the user page.
class CuratorPage {
  // Page signed in as "user".
  page: Page;

  async login() {
    await login('curator', this.page);
  }

  async routes() {
    await registerRoutes(this.page);
  }

  async init() {
    await this.login();
    await this.routes();
  }

  constructor(page: Page) {
    this.page = page;
    this.login = this.login.bind(this);
    this.routes = this.routes.bind(this);
  }
}

// Declare the types of your fixtures.
type MyFixtures = {
  ownerPage: OwnerPage;
  contributorPage: ContributorPage;
  curatorPage: CuratorPage;
};

export * from '@playwright/test';
export const test = base.extend<MyFixtures>({
  ownerPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/owner.json'
    });
    const ownerPage = new OwnerPage(await context.newPage());
    await ownerPage.init();
    await use(ownerPage);
  },
  contributorPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/contributor.json'
    });
    const contributorPage = new ContributorPage(await context.newPage());
    await contributorPage.init();
    await use(contributorPage);
  },
  curatorPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/curator.json'
    });
    const curatorPage = new CuratorPage(await context.newPage());
    await curatorPage.init();
    await use(curatorPage);
  }
});
