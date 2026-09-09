"use client";

import { createContext, useContext } from "react";

export const ADMIN_KEY_LS = "bis-admin-key";
export const AdminKeyContext = createContext<string>("");
/** 백오피스 접근 키 (AdminShell 하위에서 사용) */
export const useAdminKey = () => useContext(AdminKeyContext);
