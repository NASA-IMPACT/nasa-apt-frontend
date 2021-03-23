import { AbilityBuilder, Ability } from '@casl/ability';

// Initial ability definition.
export const ability = new Ability(defineRulesFor(null));

export function defineRulesFor(user) {
  // The AbilityBuilder is just a way to construct Ability in a declarative way.
  const { can: allow, rules } = new AbilityBuilder(Ability);

  if (user) {
    allow('manage', 'all');
  }

  return rules;
}
