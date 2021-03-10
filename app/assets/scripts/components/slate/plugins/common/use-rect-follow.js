import { useEffect } from 'react';

/**
 * Follows the given client bounds rect, adding position styles to the ref
 * element.
 *
 * @param {object} options Options
 * @param {object} options.ref Reference element to position. Must be a DOM node
 * @param {object} options.rect Bounding Rect using for positioning
 */
const useRectFollow = ({ ref, rect }) => {
  useEffect(() => {
    if (!ref.current || !rect) return;

    const el = ref.current;
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  }, [rect, ref]);
};

export default useRectFollow;
