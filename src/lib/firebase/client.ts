"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseWebConfig } from "@/lib/firebase/config";

export const isFirebaseConfigured = Boolean(
  firebaseWebConfig.apiKey && firebaseWebConfig.authDomain && firebaseWebConfig.appId
);

export const firebaseAuth = isFirebaseConfigured
  ? getAuth(
      getApps().length > 0
        ? getApp()
        : initializeApp(firebaseWebConfig)
    )
  : null;
