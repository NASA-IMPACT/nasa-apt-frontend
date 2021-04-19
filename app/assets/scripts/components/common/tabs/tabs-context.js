import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import T from 'prop-types';

// Context
const TabsContext = createContext(null);

/**
 * Context provider for the tabs.
 * Stores the active tab and registers tabs when used with <TabItem>
 *
 * @prop {node} children Children to render.
 * @prop {node} initialActive Initial active tab
 */
export function TabsManager({ children, initialActive }) {
  const [activeTab, setActiveTab] = useState(initialActive);
  const [tabList, setTabList] = useState([]);

  const registerTab = useCallback(({ id }) => {
    setTabList((list) => {
      if (list.find((t) => t.id)) {
        // Already added.
        return list;
      } else {
        return list.concat({ id });
      }
    });
  }, []);

  const unregisterTab = useCallback(({ id }) => {
    setTabList((list) => list.filter((t) => t.id !== id));
  }, []);

  // If there's no initial tab set, activate the first one being registered.
  useEffect(() => {
    if (!initialActive && tabList.length) {
      setActiveTab(tabList[0].id);
    }
  }, [initialActive, tabList]);

  const value = {
    activeTab,
    setActiveTab,
    registerTab,
    unregisterTab,
    tabList
  };

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

TabsManager.propTypes = {
  children: T.node,
  initialActive: T.string
};

/**
 * Hook for the tabs.
 * Returns the following:
 *
 * activeTab: String
 * setActiveTab: (id: String) => void
 * registerTab: ({id: String}) => void
 * unregisterTab: ({id: String}) => void
 * tabList: [{id: String}]
 *
 * @returns Object
 */
export function useTabs() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(
      `The \`useTabs\` hook must be used inside the <TabsContext> component's context.`
    );
  }

  return context;
}