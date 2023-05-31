const contactsSingle = require('./server/contacts/single.json');
const contactsCreate = require('./server/contacts/create.json');
const contactsList = require('./server/contacts/list.json');
const atbds = require('./server/atbds.json');
const stats = require('./server/stats.json');
const atbdCreated = require('./server/atbd-create.json');
const atbd = require('./server/atbd.json');
const atbdNew = require('./server/atbd-new.json');
const atbdVersions = require('./server/atbd-versions.json');
const atbdVersionNew = require('./server/atbd-version-new.json');
const atbdStatsNew = require('./server/atbd-version-new.json');
const atbdEvent = require('./server/atbd-event.json');
const atbdReviewerList = require('./server/atbd-reviewer-list.json');

export function versionWithStatus(version, status) {
  return {
    ...version,
    versions: version.versions.map((v) => {
      if (v.major === 1 && v.minor === 1) {
        return {
          ...v,
          status
        };
      } else {
        return v;
      }
    })
  };
}

export const fixtureURLs = [
  {
    url: 'http://localhost:8888/v2/contacts/1',
    getResponse: contactsSingle,
    postResponse: { ...contactsSingle, url: 'http://example.com' },
    deleteResponse: {}
  },
  {
    url: 'http://localhost:8888/v2/contacts/2',
    deleteResponse: {}
  },
  {
    url: 'http://localhost:8888/v2/contacts/3',
    getResponse: contactsCreate
  },
  {
    url: 'http://localhost:8888/v2/contacts',
    getResponse: contactsList,
    postResponse: contactsCreate
  },
  {
    url: 'http://localhost:8888/v2/atbds?role=owner',
    getResponse: atbds
  },
  {
    url: 'http://localhost:8888/v2/threads/stats?atbds=1_v2.0&atbds=2_v1.0',
    getResponse: stats
  },
  {
    url: 'http://localhost:8888/v2/threads/stats?atbds=1_v1.1',
    getResponse: stats
  },
  {
    url: 'http://localhost:8888/v2/atbds',
    getResponse: atbds,
    postResponse: atbdCreated
  },
  {
    url: 'http://localhost:8888/v2/atbds/3',
    getResponse: atbdNew
  },
  {
    url: 'http://localhost:8888/v2/atbds/3/versions/v1.0',
    getResponse: atbdVersionNew
  },
  {
    url: 'http://localhost:8888/v2/threads/stats?atbds=3_v1.0',
    getResponse: atbdStatsNew
  },
  {
    url: 'http://localhost:8888/v2/atbds/3/versions/v1.0/lock?override=false',
    putResponse: {
      email: 'curator@example.com',
      preferred_username: 'Carlos Curator'
    }
  },
  {
    url: 'http://localhost:8888/v2/atbds/test-atbd-1',
    getResponse: atbd
  },
  {
    url: 'http://localhost:8888/v2/atbds/test-atbd-1/versions/v1.1',
    getResponse: atbdVersions
  },
  {
    url: 'http://localhost:8888/v2/events',
    postResponse: atbdEvent
  },
  {
    url:
      'http://localhost:8888/v2/users?atbd_id=1&version=v1.1&user_filter=invite_reviewers',
    getResponse: atbdReviewerList
  }
];

async function registerRoute(
  page,
  { url, getResponse, postResponse, deleteResponse, putResponse }
) {
  await page.route(url, (route) => {
    if (postResponse && route.request().method() === 'POST') {
      return route.fulfill({ json: postResponse });
    } else if (putResponse && route.request().method() === 'PUT') {
      return route.fulfill({ json: putResponse });
    } else if (deleteResponse && route.request().method() === 'DELETE') {
      return route.fulfill({ json: deleteResponse });
    } else {
      return route.fulfill({ json: getResponse });
    }
  });
}

export async function registerRoutes(page) {
  for (const fixture of fixtureURLs) {
    await registerRoute(page, fixture);
  }
}
