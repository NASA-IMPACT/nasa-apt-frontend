import { useEffect, useRef } from 'react';

/**
 * Same behavior as React's useEffect but called with the values for the
 * previous dependencies.
 * @param {func} cb Hook callback
 * @param {array} deps Hook dependencies.
 */
export function useEffectPrevious(cb, deps) {
  const prev = useRef();
  const unchangingCb = useRef(cb);
  unchangingCb.current = cb;

  useEffect(() => {
    unchangingCb.current(prev.current);
    prev.current = deps;
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, deps);
}
