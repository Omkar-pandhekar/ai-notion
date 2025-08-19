import { initializeApp, getApps, getApp, App, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin";

const hasEnv =
  process.env.FB_PROJECT_ID &&
  process.env.FB_CLIENT_EMAIL &&
  process.env.FB_PRIVATE_KEY;

const serviceAccount: ServiceAccount = hasEnv
  ? {
      projectId: process.env.FB_PROJECT_ID!,
      clientEmail: process.env.FB_CLIENT_EMAIL!,
      privateKey: process.env.FB_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }
  : (() => {
      throw new Error(
        "Firebase admin credentials missing. Set FB_PROJECT_ID, FB_CLIENT_EMAIL, FB_PRIVATE_KEY."
      );
    })();

let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
