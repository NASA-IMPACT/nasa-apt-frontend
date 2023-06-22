import { useCallback, useEffect } from 'react';

import useSafeState from './use-safe-state';

/**
 * Hook to keep track of the status of an event only setting it as finished
 * after the minimum time has passed.
 *
 * @param {object} opts
 * @param {number} opts.time Minimum time to wait
 *
 * @returns {
 *  isDone: {boolean} Whether the event has finished.
 *  start: {func} Function to signal the start of the event
 *  finish: {func} Function to signal the end of the event
 * }
 */
export const useMinimumDurationEvent = ({ time = 512 } = {}) => {
  const [isFullyDone, setFullyDone] = useSafeState(false);
  const [isMinTimeDone, setMinTimeDone] = useSafeState(false);
  const [isEventDone, setEventDone] = useSafeState(false);

  const start = useCallback(() => {
    const tId = setTimeout(() => {
      setMinTimeDone(true);
      if (isEventDone) setFullyDone(true);
    }, time);
    return () => tId && clearTimeout(tId);
  }, [time, setMinTimeDone, isEventDone, setFullyDone]);

  const finish = useCallback(() => {
    setEventDone(true);
    if (isMinTimeDone) setFullyDone(true);
  }, [setEventDone, isMinTimeDone, setFullyDone]);

  return {
    isDone: isFullyDone,
    start,
    finish
  };
};

/**
 * Hook to ensure the loading state persists at least 512 ms.
 *
 * @param {object} opts
 * @param {string} opts.status Status to use for loading tracking
 */
export const useMinimumLoadingTime = ({ status }) => {
  const {
    isDone: isLoadingDone,
    start,
    finish
  } = useMinimumDurationEvent({
    time: 512
  });

  useEffect(() => {
    if (status === 'idle') return;

    if (status === 'loading') {
      start();
    } else {
      finish();
    }
  }, [start, finish, status]);

  return isLoadingDone;
};
