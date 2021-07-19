import { AbilityBuilder, Ability } from '@casl/ability';

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

  if (user?.accessToken) {
    // allow('manage', 'all');
    allow('view', 'contacts');
    allow('edit', 'contact');
    allow('view', 'profile');
    allow('edit', 'profile');
    allow('access', 'dashboard');

    if (user.groups?.find?.((g) => g.toLowerCase() === CURATOR_ROLE)) {
      allow('access', 'curator-dashboard');
      allow('delete', 'document-version');
      allow('manage-authors', 'document-version');
      allow('manage-reviewers', 'document-version');
    }
    if (user.groups.find((g) => g.toLowerCase() === CONTRIBUTOR_ROLE)) {
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
    }
  }

  return rules;
}
