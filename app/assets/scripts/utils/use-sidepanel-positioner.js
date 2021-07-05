import { useEffect, useRef } from 'react';
import throttle from 'lodash.throttle';

export const useSidePanelPositioner = (opts) => {
  const { fn, cacheElements } = opts;

  const elementRef = useRef(null);
  const inpageHeaderRef = useRef(null);
  const footerRef = useRef(null);

  // Make the element sticky by computing the height taking the header and
  // footer into account.
  useEffect(() => {
    const positioner = throttle(() => {
      if (!inpageHeaderRef.current || !cacheElements) {
        inpageHeaderRef.current = document.querySelector(
          '[data-element="inpage-header"]'
        );
      }

      if (!footerRef.current || !cacheElements) {
        footerRef.current = document.querySelector('[data-element="footer"]');
      }

      if (!inpageHeaderRef.current || !elementRef.current) return;

      const { top, height } = inpageHeaderRef.current.getBoundingClientRect();
      // The header end represents to distance of the header plus anything else
      // between it and the top of the viewport,
      const headerEnd = top + height;

      let visibleFooterHeight = 0;
      if (footerRef.current) {
        const { top } = footerRef.current.getBoundingClientRect();
        visibleFooterHeight = Math.max(0, window.innerHeight - top);
      }

      const finalElementHeight = Math.max(
        0,
        window.innerHeight - visibleFooterHeight - headerEnd
      );

      fn(elementRef, {
        height: finalElementHeight,
        top: headerEnd,
        inpageHeaderTop: top,
        inpageHeaderHeight: height
      });
    }, 16);

    // Using requestAnimationFrame with a lodash throttle is the best way to
    // ensure the outline position is appropriately calculated.
    let rafId;
    const rafRun = () => {
      positioner();
      rafId = requestAnimationFrame(rafRun);
    };

    rafRun();

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [cacheElements, fn]);

  return { ref: elementRef };
};
