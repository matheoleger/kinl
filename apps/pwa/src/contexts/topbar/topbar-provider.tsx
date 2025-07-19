import { createContext, use, useMemo, useState } from 'react';
import { TabsValue } from './types';

interface TopBarContextType {
  selectedTab: TabsValue;
  setSelectedTab: (selectedTab: TabsValue) => void;
  search: string;
  setSearch: (search: string) => void;
}

const TopBarContext = createContext<TopBarContextType>({
  selectedTab: TabsValue.ALL,
  setSelectedTab: () => {},
  search: '',
  setSearch: () => {},
});

export default function TopBarProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState<TabsValue>(TabsValue.ALL);

  const value = useMemo(() => ({
    search,
    setSearch,
    selectedTab,
    setSelectedTab,
  }), [search, selectedTab]);

  return (
    <TopBarContext value={value}>
      {children}
    </TopBarContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTopBar() {
  return use(TopBarContext);
}
