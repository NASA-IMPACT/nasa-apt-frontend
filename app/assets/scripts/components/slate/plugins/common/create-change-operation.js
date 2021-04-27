/**
 * Creates an operation to be applied in the next onChange cycle.
 *
 * @param {string} type Type of operation.
 * @param  {...any} args Arguments for the operation.
 */
export const createOp = (type = null, ...args) => ({
  type,
  args
});
