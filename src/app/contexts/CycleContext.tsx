import React, { createContext, useContext, ReactNode } from "react";

interface CycleContextType {
  cycleId: number;
}

const CycleContext = createContext<CycleContextType | undefined>(undefined);

export const useCycle = () => {
  const context = useContext(CycleContext);
  if (!context) {
    throw new Error("useCycle must be used within a CycleProvider");
  }
  return context;
};

export const CycleProvider: React.FC<{
  children: ReactNode;
  cycleId: number;
}> = ({ children, cycleId }) => (
  <CycleContext.Provider value={{ cycleId }}>{children}</CycleContext.Provider>
);
