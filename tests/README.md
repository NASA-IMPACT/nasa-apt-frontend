# Playwright tests

We use the [Playwright](https://playwright.dev/) framework to run our tests. Playwright is a Node.js library to automate Chromium, Firefox and WebKit with a single API. It enables fast cross-browser web automation.

## Folder & file structure

- `tests/` - contains all the tests
- `playwright/` - contains the playwright setup and configuration
- `playwright/fixtures.ts` - contains the fixtures for the playwright tests
- `playwright/fixtures/` - contains the server fixtures for the playwright tests
- `playwright/.auth/` - contains the authentication fixtures for the playwright tests
- `playwright/auth-utils.js` - utilities for authentication in the app
- `playwright.config.js` - contains the configuration for the playwright tests
- `.github/workflows/checks.yml` - contains the GitHub Actions workflow for the playwright tests

## Running the tests

To run the tests, run the following command:

```bash
npm run playwright:test
```

You can also run the tests individually using the playwright UI:

```bash
npm run playwright:report
```

The VSCode extension allows you to run the tests individually as well. You can also debug the tests, set breakpoints, pick locators while the tests are running, and more. To know more about the VSCode extension, check out the Playwright docs here: [https://playwright.dev/docs/getting-started-vscode](https://playwright.dev/docs/getting-started-vscode)

## Test architecture

### Page objects

We use page objects to interact with the app. Page objects are a feature of Playwright that allows us to abstract commonly used functions, selectors and actions into a class. This allows us to reuse the code and makes the tests more readable. In our app, we use page objects to have logged in pages for each user role as well alongside the anonymous `page` object provided by Playwright. You can find the page objects in `playwright/fixtures.ts`. You can learn more about Page Objects at [https://playwright.dev/docs/pom](https://playwright.dev/docs/pom)

### Fixtures

**Server fixtures**

We use fixtures to setup the server for the tests. The server fixtures are located in `playwright/fixtures/`. The server fixtures represent route responses to the backend. Use the `playwright/fixtures/server/` directory to add JSON responses from the backend.

The `playwright/fixtures/register.js` file is used to register the JSON responses to HTTP methods and routes. When adding a server response, make sure to designate it as either authenticated or anonymous and add it to the appropriate array. The arrays are then used to register the routes in the Page objects depending on the user roles.

**Auth Fixtures**

Since the NASA APT frontend uses multiple users, we have created a Page object that allows us to login as different users each with a different role. This allows us to store the login credentials in localstorage and load them back up when we need to login as the user with that particular role. The authentication mechanism is the following:

1. We generate the `storageState` of the user by logging in as the user and storing the localstorage of the user in a JSON file. This is done in the initial tests found in `tests/auth.setup.js`. The `storageState` is stored in `playwright/.auth/` folder.

2. We extend the `Page` class from Playwright to create a `LoggedInPage` class that has a `login` method that allows us to login as a user with a particular role. The `login` method takes in a `role` parameter that is used to determine which user to login as. The `LoggedInPage` takes a context which is initialized with the `storageState` of the user. The `storageState` is a JSON file that contains the localstorage of the user. This allows us to login as the user without having to enter the credentials each time.

```js
  ownerPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/owner.json'
    });
    const ownerPage = new LoggedInPage(await context.newPage(), 'owner');
    await ownerPage.init();
    await use(ownerPage);
  },
```

The init function calls `.login()` on the page object which logs in the user with the role specified in the constructor. It also calls `.routes()` which sets up the routes for the page object. The routes are used to intercept requests and responses and perform actions based on the request and response.

3. In a test where we need to use the owner credentials, instead of using the standard `test` function from Playwright, we use the `ownerPage` fixture that we created. This allows us to login as the owner user and use the `ownerPage` object to interact with the app.

```js
import { test, expect } from '../../playwright/fixtures';

test('should be able to login as owner', async ({ ownerPage }) => {
  const { page } = ownerPage;
  await page.goto('/dashboard');
  await expect(page).toHaveText('h1', 'Dashboard');
});
```

### Writing tests

**Playwright tools for writing tests**

Playwright differs from other testing frameworks by using accessibility selectors to locate elements on the page. This allows us to write tests that are more resilient to changes in the DOM. When you write a test, you can use the record mechanism to record the behavior of the user on the page as well as select elements on the page to use as locators. You can learn more about VSCode here: [https://playwright.dev/docs/getting-started-vscode](https://playwright.dev/docs/getting-started-vscode)

**Writing your first test**

We want to test individual behaviors by logged in users. For example, we want to test that a contributor can create a new document. Here's what that test looks like:

```js
test('create document', async ({ contributorPage: { page } }) => {
  await page.goto('http://localhost:9000/dashboard');
  await page.getByRole('button', { name: ' Create' }).click();
  await page.getByRole('button', { name: 'Create new ATBD' }).click();

  await expect(page.getByLabel('ATBD Title')).toHaveValue('Untitled Document');
});
```

Notice that we use the page variable from the `contributorPage` fixture. This allows us to login as the contributor user and use the `contributorPage` object to interact with the app.

We then use the `getByRole` function to select the button with the name ` Create` and click on it. We then select the button with the name `Create new ATBD` and click on it. We then use the `getByLabel` function to select the input with the label `ATBD Title` and check that it has the value `Untitled Document`.

Also notice that we did not use any special selectors to select the elements on the page. We used the `getByRole` and `getByLabel` functions to select the elements. These functions are provided by Playwright and allow us to select elements on the page using accessibility selectors. You can learn more about accessibility selectors here: [https://playwright.dev/docs/locators](https://playwright.dev/docs/locators)

**Writing tests with server responses**

There are two scenarios where we use server responses in our tests:

1. We are testing that a particular request is made to the backend. For example, we want to test that when a user creates a new document, a POST request is made to the backend. We use the `waitForRequest` function to wait for the request to be made and then check that the request was made with the correct parameters.

```js
import { test, expect } from '../../playwright/fixtures';

test('owner requests review', async ({ ownerPage }) => {
  const { page } = ownerPage;

  // Click on the request review button
  const [request] = await Promise.all([
    page.waitForRequest('http://localhost:8888/v2/events'),
    page.getByRole('button', { name: ' Request review' }).click()
  ]);

  // Inspect the request
  await expect(JSON.parse(request.postData())).toEqual({
    atbd_id: 'test-atbd-1',
    version: 'v1.1',
    action: 'request_closed_review',
    payload: {}
  });
});
```

In this test we have mocked the response to the request in the server fixtures. However, we are only testing the request that is going out with `waitForRequest`. We are not testing the response that comes back from the backend.

Notice that we are using `Promise.all` to await on both `waitForRequest` and `page.getByRole` to make sure that both functions are called before we continue with the test.

2. We are testing that a particular response is received from the backend. For example, we want to test that when a user requests a review, a success message is displayed. We use the `waitForResponse` function to wait for the response to be received and then check that the response was received with the correct parameters.

```js
import { test, expect } from '../../playwright/fixtures';

test('edit contacts', async ({ contributorPage: { page } }) => {
  // Go to a contact
  await page.goto('http://localhost:9000/contacts/1/edit');

  // Fill in the URL
  await page.getByLabel('Url').fill('http://example.com');

  // Hit Save
  const [response] = await Promise.all([
    page.waitForResponse('http://localhost:8888/v2/contacts/1'),
    page.getByRole('button', { name: ' Save' }).click()
  ]);
  const json = await response.json();

  // Make sure that the backend is returning the correct response
  await expect(json.url).toBe('http://example.com');

  // Make sure that the frontend is displaying the correct data
  await expect(page.getByTitle('Contact Details')).toContainText(
    'http://example.com'
  );
  await expect(page.url()).toBe('http://localhost:9000/contacts/1');
});
```
