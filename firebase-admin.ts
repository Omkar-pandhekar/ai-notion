import { initializeApp, getApps, getApp, App, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin";
import serviceKey from "./service_key.json";

const serviceAccount: ServiceAccount = {
  projectId: serviceKey.project_id,
  clientEmail: serviceKey.client_email,
  privateKey: serviceKey.private_key.replace(/\\n/g, "\n"),
};

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
