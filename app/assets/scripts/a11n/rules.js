import { AbilityBuilder, Ability } from '@casl/ability';

import {
  CLOSED_REVIEW,
  CLOSED_REVIEW_REQUESTED,
  DRAFT,
  REVIEW_PROGRESS
} from '../components/documents/status';

// Initial ability definition.
export const ability = new Ability(defineRulesFor(null), {
  detectSubjectType: (object) => {
    if (object.version && object.status) return 'document-version';
  }
});

export const CURATOR_ROLE = 'curator';
export const CONTRIBUTOR_ROLE = 'contributor';

export function defineRulesFor(user) {
  // The AbilityBuilder is just a way to construct Ability in a declarative way.
  const { can: allow, rules } = new AbilityBuilder(Ability);

  const is = (r) => user?.groups?.some?.((g) => g.toLowerCase() === r);

  if (user?.accessToken) {
    // allow('manage', 'all');
    allow('view', 'profile');
    allow('edit', 'profile');
    allow('access', 'dashboard');

    if (is(CURATOR_ROLE)) {
      allow('view', 'contacts');
      allow('edit', 'contact');
      allow('access', 'curator-dashboard');
      allow('delete', 'document-version');
      allow('manage-authors', 'document-version');
      allow('manage-reviewers', 'document-version');
      allow('change-lead-author', 'document-version');
      allow('manage-req-review', 'document-version', {
        status: CLOSED_REVIEW_REQUESTED
      });
      allow('open-review', 'document-version', {
        status: CLOSED_REVIEW
      });
    }
    if (is(CONTRIBUTOR_ROLE)) {
      allow('view', 'contacts');
      allow('edit', 'contact');
      allow('access', 'contributor-dashboard');
      allow('create', 'documents');
      // Edit document is used to access the edit page.
      allow('edit', 'document');
      allow('delete', 'document-version', {
        'owner.sub': user.id
      });
      allow('edit', 'document-version', {
        'owner.sub': user.id
      });
      allow('edit', 'document-version', {
        'authors.sub': user.id
      });
      allow('manage-authors', 'document-version', {
        'owner.sub': user.id
      });
      // Only curator can manage reviewers.
      // allow('manage-reviewers', 'document-version');
      allow('change-lead-author', 'document-version', {
        'owner.sub': user.id
      });

      // Governance actions
      allow('req-review', 'document-version', {
        'owner.sub': user.id,
        status: DRAFT
      });
      allow('cancel-req-review', 'document-version', {
        'owner.sub': user.id,
        status: CLOSED_REVIEW_REQUESTED
      });
      allow('set-own-review-done', 'document-version', {
        reviewers: {
          $elemMatch: { sub: user.id, review_status: REVIEW_PROGRESS }
        },
        status: CLOSED_REVIEW
      });
    }
  }

  return rules;
}
