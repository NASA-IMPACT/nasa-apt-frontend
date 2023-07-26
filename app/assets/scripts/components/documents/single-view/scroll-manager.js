import smoothscroll from 'smoothscroll-polyfill';
// Kick off the polyfill! The native scroll API supports animating the scroll
// with behavior: 'smooth' but it is not supported in every browser, hence the
// polyfill.
smoothscroll.polyfill();

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import T from 'prop-types';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import useDimensions from 'react-cool-dimensions';

/**
See adr/0003-scroll.md for decision motivation.

The scroll manager is used in the Document View page and is responsible for the
smooth scroll navigation within the ATBD contents.

It:
- Navigates to the section indicated by `location.hash` once the component
  mounts
- Tracks the active section when the user scrolls by checking if it reached the
  threshold (below the sticky header)
- Ensures that the link to the active section on the outline is set as active
  (using a hook)
- Scrolls the page to the section that corresponds to the clicked link on the
  outline
- Keeps `location.hash` updated when the active section changes

Indirectly it also ensures that the link to the active section on the outline is
visible (by scrolling the outline container). This is done in the outline
component by acting when the active item changes.

The scroll manager starts by creating an index of all target elements (items
with `[data-scroll="target"]`) and for each one stores their id and their
position from the top of the page. Every time there's a scroll event this list
is searched for the item that last passed the threshold. This ensures that a
section does not become inactive before another one is ready to be activated.

NOTE: The target index is created when the component mounts. If additional
children are added at a later stage they won't be picked up. Currently the index
is not automatically rebuilt. This is by design.
 */

// The elements that can be a target to scroll to, must have this attribute.
// This is used to create the position list.
const TARGET_SELECTOR = '[data-scroll="target"]';
// Offset from top at which an item is considered active. This is the header
// height plus a buffer. This is the starting value and can be overwritten.
const BASE_OFFSET_TOP = 100;
// The document header section is not part of the document body (holds the
// title and other meta information) but we want it to be the default active
// when the scroll position is at the top.
// TODO: This is very tailored to the document view page, and should be
// abstracted.
const TOP_SCROLL_ITEM = { id: 'doc-header' };

/**
 * Searches the DOM for items with the TARGET_SELECTOR and gets their id and
 * position from the top. It return a list of items.
 * {
 *   id: String
 *   top: Number
 * }
 * @returns Array<Object>
 */
function gatherTargetItems() {
  // Because the offset is relative to the offsetParent (any element with
  // position defined) we have to traverse the dom until we reach the top.
  const getTotalOffset = (node) => {
    let n = node;
    let total = 0;
    while (n) {
      total += n.offsetTop;
      n = n.offsetParent;
    }
    return total;
  };

  const targets = window.document.querySelectorAll(TARGET_SELECTOR);
  return Array.from(targets).map((el) => ({
    id: el.id,
    top: getTotalOffset(el)
  }));
}

/**
 * Sets the given id as the location hash value. If the id is null it will
 * remove the hash entirely.
 * @param {string} id The id to set in the location hash.
 */
const setIdOnHash = (id) => {
  const {
    location: { pathname, search },
    history
  } = window;

  if (id) {
    history.replaceState(null, null, `#${id}`);
  } else {
    history.replaceState(null, null, pathname + search);
  }
};

/**
 * Gets the id fro the location hash, removing the # sign. It will return null
 * if a hash is not set.
 * @returns String | null
 */
const getIdFromHash = () => {
  const { hash } = location;
  return hash ? hash.slice(1) || null : null;
};

// Context
const ScrollContext = createContext(null);

/**
 * Context provider for the scroll behavior. It will prepare the target items
 * list on mount and add listeners to recreate the list if the window size
 * changes. This is needed because the position of the items may change on
 * resize.
 *
 * Note: Since this computes the list item on mount, all the items must exist.
 * This is not compatible with dynamic content.
 *
 * @prop {node} props The children to render
 */
export function ScrollAnchorProvider({ disabled = false, children }) {
  const [targetItems, setTargetItems] = useState([]);
  const [activeItem, setActiveItem] = useState(TOP_SCROLL_ITEM);
  const [scrollInitiator, setScrollInitiator] = useState(null);
  const [globalTopOffset, setGlobalTopOffset] = useState(BASE_OFFSET_TOP);

  const { ref, height } = useDimensions();
  const previousHeight = useRef(null);

  const debouncedGather = useMemo(
    () =>
      debounce(() => {
        const items = gatherTargetItems()
          // The item's top position is set based on their position, but we want
          // the first item's position to be 0, because it's the meta
          // information.
          .map((item) =>
            item.id === TOP_SCROLL_ITEM.id ? { ...item, top: 0 } : item
          );
        setTargetItems(items);
      }, 100),
    []
  );

  // It is not enough to use a window resize event in this case. We have to
  // listen for the body to actually increase in size. This happens when images
  // load for example.
  useEffect(() => {
    if (height !== previousHeight.current) {
      previousHeight.current = height;
      debouncedGather();
    }
  }, [debouncedGather, height]);

  const scrollToId = useCallback(
    (targetId) => {
      const target = targetItems.find((t) => t.id === targetId);

      if (target) {
        setActiveItem(target);
        window.scroll({
          top: target.top - globalTopOffset,
          left: 0,
          behavior: 'smooth'
        });
      }
    },
    [targetItems, globalTopOffset, setActiveItem]
  );

  const contextValue = !disabled
    ? {
        scrollToId,
        setGlobalTopOffset,
        targetItems,
        globalTopOffset,
        activeItem,
        setActiveItem,
        scrollInitiator,
        setScrollInitiator
      }
    : {};

  return (
    <ScrollContext.Provider value={contextValue}>
      <div ref={ref}>{children}</div>
    </ScrollContext.Provider>
  );
}

ScrollAnchorProvider.propTypes = {
  children: T.node,
  disabled: T.bool
};

/**
 * Hook for the scroll links.
 * Returns the following:
 *
 * getScrollToId(id: String) -> returns a click handler for the link that will
 * prevent the default behavior and scroll to the given id.
 *
 * activeId -> Id of the active item.
 *
 * @returns Object
 */
export function useScrollLink() {
  const { scrollToId, setScrollInitiator, activeItem } =
    useContext(ScrollContext);

  const getScrollToId = useCallback(
    (id) => (event) => {
      event?.preventDefault?.();
      scrollToId(id);
      setScrollInitiator('link');
      setIdOnHash(id);
    },
    [scrollToId, setScrollInitiator]
  );

  return {
    getScrollToId,
    activeId: activeItem?.id || null
  };
}

/**
 * If there's an id in the hash it will scroll to it on mount, or every time the
 * list of items change.
 */
export function useScrollToHashOnMount(disable = false) {
  const { scrollToId } = useContext(ScrollContext);

  useEffect(() => {
    if (disable) {
      return;
    }

    const targetId = getIdFromHash();

    if (targetId) {
      scrollToId(targetId);
    }
  }, [disable, scrollToId]);
}

/**
 * Hook to setup the scroll listener that will activate links when the user
 * scrolls.
 */
export function useScrollListener(disable = false) {
  const {
    targetItems,
    setActiveItem,
    scrollInitiator,
    setScrollInitiator,
    globalTopOffset
  } = useContext(ScrollContext) ?? {};

  useEffect(() => {
    // If we're scrolling to a position because a link was clicked we don't want
    // the hash to be constantly updating. So the event listener gets replaced
    // for one that listens for the end of the scroll. Once scrolling stops we
    // reset the initiator and in turn that triggers the useEffect which sets
    // the scrolling listener again.
    if (scrollInitiator === 'link') {
      const scrollListener = debounce(() => {
        setScrollInitiator(null);
      }, 100);

      window.addEventListener('scroll', scrollListener);
      return () => {
        window.removeEventListener('scroll', scrollListener);
      };
    }

    const scrollListener = throttle(() => {
      const scroll = window.scrollY;

      // Find the first item that's on view.
      const activeItem = [...targetItems]
        .reverse()
        .find((item) => item.top - globalTopOffset <= scroll);

      setActiveItem(activeItem || null);
      setIdOnHash(activeItem?.id || null);
    }, 250);

    if (!disable) {
      window.addEventListener('scroll', scrollListener);
    }

    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [
    disable,
    targetItems,
    setActiveItem,
    scrollInitiator,
    setScrollInitiator,
    globalTopOffset
  ]);
}
