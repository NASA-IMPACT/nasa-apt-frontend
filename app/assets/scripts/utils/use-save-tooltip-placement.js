import { useEffect } from 'react';

/**
 * The save button tooltip needs a specific z-index value as to not appear below
 * other element.
 * However there's no way to set it any other way because the library doesn't
 * allow to configure the wrappers of the portaled tooltip itself.
 *
 * @param {opts} opts Options
 * @param {bool} opts.showing Whether or not the tooltip is visible
 * @param {string} opts.tipMessage The current tooltip message
 */
export function useSaveTooltipPlacement({ showing, tipMessage }) {
  useEffect(() => {
    if (showing) {
      // Timeout needed to account for the tooltip's animation.
      setTimeout(() => {
        const el = Array.from(
          document.querySelectorAll('.tippy-tooltip-content')
        ).find((el) => el.textContent === tipMessage);

        if (el) {
          el.parentElement.parentElement.style.zIndex = 8000;
        }
      }, 320);
    }
  }, [tipMessage, showing]);
}
