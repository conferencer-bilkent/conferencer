import React, { createContext, useState, useEffect, useContext } from "react";
import { Conference } from "../models/conference";

type ContextType = {
  activeConference: Conference | null;
  setActiveConference: (conf: Conference) => void;
};

const ConferenceContext = createContext<ContextType | undefined>(undefined);

export const ConferenceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeConference, setActiveConferenceState] =
    useState<Conference | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("activeConference");
    if (stored) setActiveConferenceState(JSON.parse(stored));
  }, []);

  const setActiveConference = (conf: Conference) => {
    setActiveConferenceState(conf);
    localStorage.setItem("activeConference", JSON.stringify(conf));
  };

  return (
    <ConferenceContext.Provider
      value={{ activeConference, setActiveConference }}
    >
      {children}
    </ConferenceContext.Provider>
  );
};

export const useConference = () => {
  const ctx = useContext(ConferenceContext);
  if (!ctx) throw new Error("useConference must be inside ConferenceProvider");
  return ctx;
};
