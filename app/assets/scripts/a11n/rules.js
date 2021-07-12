import { AbilityBuilder, Ability } from '@casl/ability';

// Initial ability definition.
export const ability = new Ability(defineRulesFor(null));

export function defineRulesFor(user) {
  // The AbilityBuilder is just a way to construct Ability in a declarative way.
  const { can: allow, rules } = new AbilityBuilder(Ability);

  if (user?.accessToken) {
    // allow('manage', 'all');
    allow('edit', 'document'); // TODO: Depends on document
    allow('create', 'documents');
    allow('edit', 'atbd');
    allow('view', 'contacts');
    allow('edit', 'contacts');
    allow('view', 'profile');
    allow('edit', 'profile');
    allow('access', 'dashboard');

    if (user.groups?.find?.((g) => g.toLowerCase() === 'curator')) {
      allow('access', 'curator-dashboard');
    } else {
      // } if (user.groups.find(g => g.toLowerCase() === 'author')) {
      allow('access', 'author-dashboard'); // TODO: Only with group
    }
  }

  return rules;
}
