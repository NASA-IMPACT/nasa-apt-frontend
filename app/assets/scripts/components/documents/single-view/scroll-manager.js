import smoothscroll from 'smoothscroll-polyfill';
// kick off the polyfill!
smoothscroll.polyfill();

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import T from 'prop-types';
import debounce from 'lodash.debounce';

const TARGET_SELECTOR = '[data-scroll="target"]';
const BASE_OFFSET_TOP = 100;

function gatherTargetItems() {
  const targets = document.querySelectorAll(TARGET_SELECTOR);
  return Array.from(targets).map((el) => ({
    id: el.id,
    top: el.offsetTop
  }));
}

const setIdOnHash = (id) => {
  const {
    location: { pathname, search },
    history
  } = window;

  if (id) {
    history.pushState(null, null, `#${id}`);
  } else {
    history.pushState(null, null, pathname + search);
  }
};

const getIdFromHash = () => {
  const { hash } = location;
  return hash ? hash.slice(1) || null : null;
};

// Context
const ScrollContext = createContext(null);

export function ScrollAnchorProvider({ children }) {
  const [targetItems, setTargetItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [globalTopOffset, setGlobalTopOffset] = useState(BASE_OFFSET_TOP);

  useEffect(() => {
    setTargetItems(gatherTargetItems());

    const resizeListener = debounce(() => {
      setTargetItems(gatherTargetItems());
    }, 100);

    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

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

  const contextValue = {
    scrollToId,
    setGlobalTopOffset,
    targetItems,
    globalTopOffset,
    activeItem,
    setActiveItem
  };

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
}

ScrollAnchorProvider.propTypes = {
  children: T.node
};

export function useScrollLink() {
  const { scrollToId, activeItem } = useContext(ScrollContext);

  const getScrollToId = useCallback(
    (id) => (event) => {
      event?.preventDefault?.();
      scrollToId(id);
      setIdOnHash(id);
    },
    [scrollToId]
  );

  return {
    getScrollToId,
    activeId: activeItem?.id || null
  };
}

export function useScrollToHashOnMount() {
  const { scrollToId } = useContext(ScrollContext);

  useEffect(() => {
    const targetId = getIdFromHash();

    if (targetId) {
      scrollToId(targetId);
    }
  }, [scrollToId]);
}

export function useScrollListener() {
  const { targetItems, setActiveItem, globalTopOffset } = useContext(
    ScrollContext
  );

  useEffect(() => {
    const scrollListener = debounce(() => {
      const scroll = window.scrollY;

      // Find the first item that's on view.
      const activeItem = [...targetItems]
        .reverse()
        .find((item) => item.top - globalTopOffset <= scroll);

      setActiveItem(activeItem || null);
      setIdOnHash(activeItem?.id || null);
    }, 250);

    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [targetItems, setActiveItem, globalTopOffset]);
}
