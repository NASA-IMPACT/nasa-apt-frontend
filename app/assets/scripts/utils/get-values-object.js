import get from 'lodash.get';

import { editorEmptyValue } from '../components/slate';

export const EDITOR_SYM = Symbol.for('<editor>');

/**
 * Returns the default object filled with values from source if they exist. If
 * not the defaults are use.
 *
 * @usage
 * getValuesFromObj(source, {
 *  value: '',
 *  nested: {
 *    other: 2
 *  }
 * })
 *
 * @param {object} obj source object. Expected to be an ATBD
 * @param {object} defaults defaults object
 */
export const getValuesFromObj = (obj, defaults) => {
  const recursiveGet = (_obj, _defaults) =>
    Object.keys(_defaults).reduce((acc, key) => {
      const defValue = _defaults[key];
      const source = get(_obj, key);
      const isArray = Array.isArray(defValue);
      const isObject = !isArray && defValue instanceof Object;

      // The fallback value can be changed with some tags. This is needed
      // because values set as object are recursively computed.
      const value = defValue === EDITOR_SYM ? editorEmptyValue : defValue;
      // Is the expected value is an array, then check by length.
      if (isArray && !source?.length) {
        return {
          ...acc,
          [key]: value
        };
      }

      return {
        ...acc,
        [key]: isObject ? recursiveGet(source || {}, defValue) : source || value
      };
    }, {});

  return {
    // The id of the object will never be changed but is useful to have present.
    id: obj.id,
    ...recursiveGet(obj, defaults)
  };
};
