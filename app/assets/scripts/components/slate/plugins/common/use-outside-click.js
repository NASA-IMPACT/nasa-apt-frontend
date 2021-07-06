import { useEffect } from 'react';

/**
 * Listen for a click outside the ref element and call listener when it happens.
 *
 * @param {object} options Options
 * @param {object} options.ref Reference element outside of which clicks should
 * be captured. Must be a DOM node.
 * @param {function} options.listener Listener for outside clicks
 */
const useOutsideClick = ({ ref, listener }) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        listener(event);
      }
    };

    // Bind the event listener.
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up.
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, listener]);
};

export default useOutsideClick;
