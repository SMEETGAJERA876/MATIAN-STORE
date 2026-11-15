import fs from "fs";
import path from "path";
import { testFirebaseConnection } from "../src/lib/firebaseStore";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    const name = key.trim();
    if (
      ![
        "FIREBASE_SERVICE_ACCOUNT_JSON",
        "FIREBASE_PROJECT_ID",
        "FIREBASE_DATABASE_URL",
      ].includes(name)
    ) {
      continue;
    }
    process.env[name] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
  }
}

async function main() {
  loadEnvLocal();
  await testFirebaseConnection();
  console.log("Firebase Realtime Database connection succeeded.");
}

main().catch((error) => {
  console.error("Firebase Realtime Database connection failed:", error);
  process.exitCode = 1;
});
