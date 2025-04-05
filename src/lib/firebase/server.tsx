/* eslint-disable @typescript-eslint/no-explicit-any */
import admin from "firebase-admin";
import fireConfig from "../../../service-account.json";

try {
  admin.initializeApp({
    credential: admin.credential.cert(fireConfig as admin.ServiceAccount),
  });
} catch (error: any) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export default admin;
