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
const atbdStatsNew = require('./server/stats-new.json');
const atbdEvent = require('./server/atbd-event.json');
const atbdReviewerList = require('./server/atbd-reviewer-list.json');

const atbdPDF = require('./server/pdf/atbd-pdf.json');
const atbdPDFVersion = require('./server/pdf/atbd-pdf-version.json');
const atbdPDFStats = require('./server/pdf/atbd-pdf-stats.json');

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

export const authenticatedFixturePDFUrls = [
  {
    url: 'http://localhost:8888/v2/atbds/pdf-document',
    getResponse: atbdPDF
  },
  {
    url: 'http://localhost:8888/v2/atbds/227',
    getResponse: atbdPDF
  },
  {
    url: 'http://localhost:8888/v2/atbds/pdf-document/versions/v1.0',
    getResponse: atbdPDFVersion
  },
  {
    url: 'http://localhost:8888/v2/atbds/227/versions/v1.0',
    getResponse: atbdPDFVersion
  },
  {
    url: 'http://localhost:8888/v2/threads/stats?atbds=227_v1.0',
    getResponse: atbdPDFStats
  },
  {
    url: 'http://localhost:8888/v2/atbds/pdf-document/versions/v1.0/lock?override=false',
    putResponse: {
      email: 'olivia@example.com',
      preferred_username: 'Olivia Owner'
    }
  },
  {
    url: 'http://localhost:8888/v2/atbds/227/versions/v1.0/lock?override=false',
    putResponse: {
      email: 'olivia@example.com',
      preferred_username: 'Olivia Owner'
    }
  }
];

export const authenticatedFixtureUrls = [
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
    url: 'http://localhost:8888/v2/atbds/new-document',
    getResponse: atbdNew
  },
  {
    url: 'http://localhost:8888/v2/atbds/new-document/versions/v1.0',
    getResponse: atbdVersionNew
  },
  {
    url: 'http://localhost:8888/v2/threads/stats?atbds=3_v1.0',
    getResponse: atbdStatsNew
  },
  {
    url: 'http://localhost:8888/v2/atbds/new-document/versions/v1.0/lock?override=false',
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
    url: 'http://localhost:8888/v2/users?atbd_id=1&version=v1.1&user_filter=invite_reviewers',
    getResponse: atbdReviewerList
  },
  ...authenticatedFixturePDFUrls
];

export const anonymousFixtureUrls = [
  {
    url: 'http://localhost:8888/v2/atbds/test-atbd-1',
    getResponse: { detail: 'No atbds found' },
    status: 404
  },
  {
    url: 'http://localhost:8888/v2/atbds/test-atbd-1/versions/v1.1',
    getResponse: { detail: 'View for ATBD Version is not allowed' },
    status: 403
  }
];

async function registerRoute(
  page,
  { url, getResponse, postResponse, deleteResponse, putResponse, status = 200 }
) {
  await page.route(url, (route) => {
    if (postResponse && route.request().method() === 'POST') {
      return route.fulfill({ status, json: postResponse });
    } else if (putResponse && route.request().method() === 'PUT') {
      return route.fulfill({ status, json: putResponse });
    } else if (deleteResponse && route.request().method() === 'DELETE') {
      return route.fulfill({ status, json: deleteResponse });
    } else {
      return route.fulfill({ status, json: getResponse });
    }
  });
}

export async function registerAuthenticatedRoutes(page) {
  for (const fixture of authenticatedFixtureUrls) {
    await registerRoute(page, fixture);
  }
}

export async function registerAnonymousRoutes(page) {
  for (const fixture of anonymousFixtureUrls) {
    await registerRoute(page, fixture);
  }
}
