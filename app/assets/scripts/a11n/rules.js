import { AbilityBuilder, Ability } from '@casl/ability';

// Initial ability definition.
export const ability = new Ability(defineRulesFor(null), {
  detectSubjectType: (object) => {
    if (object.version && object.status) return 'document-version';
  }
});

export function defineRulesFor(user) {
  // The AbilityBuilder is just a way to construct Ability in a declarative way.
  const { can: allow, rules } = new AbilityBuilder(Ability);

  if (user?.accessToken) {
    // allow('manage', 'all');
    allow('create', 'documents');
    allow('view', 'contacts');
    allow('edit', 'contact');
    allow('view', 'profile');
    allow('edit', 'profile');
    allow('access', 'dashboard');

    if (user.groups?.find?.((g) => g.toLowerCase() === 'curator')) {
      allow('access', 'curator-dashboard');
      allow('delete', 'document-version');
    } else {
      // } if (user.groups.find(g => g.toLowerCase() === 'author')) {
      allow('access', 'contributor-dashboard');
      allow('delete', 'document-version', {
        'owner.sub': user.id
      });
      allow('edit', 'document-version', {
        'owner.sub': user.id
      });
      allow('edit', 'document-version', {
        'authors.sub': user.id
      });
    }
  }

  return rules;
}
