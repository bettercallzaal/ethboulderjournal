"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface BonfireOption {
  id: string;
  label: string;
  bonfireId: string;
  agentId: string;
  color: string;
}

interface BonfireSelectionState {
  active: BonfireOption;
  options: BonfireOption[];
  setActive: (id: string) => void;
}

/** Available bonfires — add new entries here when more are available */
const BONFIRE_OPTIONS: BonfireOption[] = [
  {
    id: "zabal",
    label: "ZABAL",
    bonfireId:
      process.env["NEXT_PUBLIC_BONFIRE_ID"] ?? "698b70002849d936f4259848",
    agentId:
      process.env["NEXT_PUBLIC_AGENT_ID"] ?? "698b70742849d936f4259849",
    color: "#ff6b2b",
  },
];

const DEFAULT_OPTION = BONFIRE_OPTIONS[0]!;
const STORAGE_KEY = "bonfire-selection";

const BonfireSelectionContext = createContext<BonfireSelectionState>({
  active: DEFAULT_OPTION,
  options: BONFIRE_OPTIONS,
  setActive: () => {},
});

export function BonfireSelectionProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState<BonfireOption>(DEFAULT_OPTION);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const found = BONFIRE_OPTIONS.find((o) => o.id === stored);
        if (found) setActiveState(found);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const setActive = useCallback((id: string) => {
    const found = BONFIRE_OPTIONS.find((o) => o.id === id);
    if (found) {
      setActiveState(found);
      try {
        localStorage.setItem(STORAGE_KEY, id);
      } catch {
        // localStorage unavailable
      }
    }
  }, []);

  return (
    <BonfireSelectionContext.Provider
      value={{ active, options: BONFIRE_OPTIONS, setActive }}
    >
      {children}
    </BonfireSelectionContext.Provider>
  );
}

export function useBonfireSelection() {
  return useContext(BonfireSelectionContext);
}
