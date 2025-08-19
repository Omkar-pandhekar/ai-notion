import { initializeApp, getApps, getApp, App, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin";

let app: App | null = null;

function ensureApp() {
  if (app) return app;

  const projectId = process.env.FB_PROJECT_ID;
  const clientEmail = process.env.FB_CLIENT_EMAIL;
  const rawKey = process.env.FB_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    throw new Error(
      "Firebase admin credentials missing. Set FB_PROJECT_ID, FB_CLIENT_EMAIL, FB_PRIVATE_KEY."
    );
  }

  const serviceAccount: ServiceAccount = {
    projectId,
    clientEmail,
    privateKey: rawKey.replace(/\\n/g, "\n"),
  };

  app = getApps().length
    ? getApp()
    : initializeApp({ credential: cert(serviceAccount) });
  return app;
}

export function getAdminDb() {
  return getFirestore(ensureApp());
}
