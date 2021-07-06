import { useContext } from 'react';

/**
 * Creates a hook to check if the context exists.
 *
 * @param {object} ctx React context to check
 * @param {string} name The context name
 *
 * @returns react hook to check context existence
 */
export const createContextChecker = (ctx, name) => (fnName) => {
  const context = useContext(ctx);
  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <${name}> component's context.`
    );
  }

  return context;
};
