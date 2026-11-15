import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

const APP_NAME = "matrin-store";

function getAdminApp() {
  const existing = getApps().find((app) => app.name === APP_NAME);
  if (existing) return existing;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const databaseURL =
    process.env.FIREBASE_DATABASE_URL ||
    "https://matrin-product-default-rtdb.asia-southeast1.firebasedatabase.app/";

  if (!serviceAccountJson) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON in the server environment."
    );
  }

  let serviceAccount: {
    project_id?: string;
    client_email?: string;
    private_key?: string;
  };
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON must be valid service-account JSON.");
  }

  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("Firebase service-account JSON is missing required credential fields.");
  }

  const expectedProjectId = process.env.FIREBASE_PROJECT_ID || "matrin-product";
  if (serviceAccount.project_id !== expectedProjectId) {
    throw new Error("Firebase service-account project does not match FIREBASE_PROJECT_ID.");
  }

  return initializeApp(
    {
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
      }),
      databaseURL,
    },
    APP_NAME
  );
}

export function getFirebaseAdminAuth() {
  return getAuth(getAdminApp());
}

export function getFirebaseAdminDatabase() {
  return getDatabase(getAdminApp());
}

export function getFirebaseConfigStatus() {
  return {
    projectId: process.env.FIREBASE_PROJECT_ID || "matrin-product",
    databaseURL:
      process.env.FIREBASE_DATABASE_URL ||
      "https://matrin-product-default-rtdb.asia-southeast1.firebasedatabase.app/",
    serviceAccountConfigured: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON),
    adminEmailConfigured: Boolean(process.env.ADMIN_EMAIL),
    authWebConfigConfigured: Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
        process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    ),
  };
}
