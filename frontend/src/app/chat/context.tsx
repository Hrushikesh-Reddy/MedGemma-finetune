"use client";
import { createContext, useContext } from "react";

const SessionContext = createContext<any>(null);

export const useSession = () => useContext(SessionContext);

export default SessionContext;