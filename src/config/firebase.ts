
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

import {
    initializeApp,
    cert,
    getApps
} from "firebase-admin/app";

import { getFirestore } from "firebase-admin/firestore";

dotenv.config();

const serviceAccountPath = path.resolve(
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH!
);

const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
);

const firebaseApp =
    getApps().length === 0
        ? initializeApp({
            credential: cert(serviceAccount)
        })
        : getApps()[0];

export const firestore = getFirestore(firebaseApp);
