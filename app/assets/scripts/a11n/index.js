import React, { createContext } from 'react';
import T from 'prop-types';
import { createContextualCan, useAbility } from '@casl/react';
import { ability, defineRulesFor } from './rules';

// Context bound functions for CASL.
// In the case of APT we only need one set of rules (Ability) and therefore we
// can bound all the authorization functions to that Ability context.
const AbilityContext = createContext();

export const Can = createContextualCan(AbilityContext.Consumer);
export const useContextualAbility = () => useAbility(AbilityContext);

export const updateAbilityFor = (ab, user) => ab.update(defineRulesFor(user));

export function AbilityProvider(props) {
  const { children } = props;

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

AbilityProvider.propTypes = {
  children: T.node
};
