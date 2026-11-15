# Firebase setup

The store uses Firebase Authentication for customer/admin sign-in and Firebase Realtime Database for products, categories, orders, customers, reviews, support tickets, notifications, settings, and inventory. Firebase Admin SDK access is server-only; the browser does not read or write the database directly.

## Firebase project

This app is configured for:

- Project ID: `matrin-product`
- Realtime Database URL: `https://matrin-product-default-rtdb.asia-southeast1.firebasedatabase.app/`

In the Firebase Console:

1. Confirm the Realtime Database exists at the URL above. Keep its database rules locked; the app's server uses Firebase Admin SDK.
2. Under **Authentication > Sign-in method**, enable **Email/Password**.
3. In the same **Sign-in method** page, enable **Google** and choose a support email.
4. Under **Authentication > Settings > Authorized domains**, add the Vercel hostname and any custom domain used for the store.
5. Under **Project settings > General**, register a Web App and copy its `apiKey`, `authDomain`, and `appId`.
6. Under **Authentication > Users**, create the admin account and verify its email address. Set that email as `ADMIN_EMAIL` in Vercel. Admin access requires the verified email to match this server-side value.
7. In **Project settings > Service accounts**, generate a private key. Keep it private; do not send it in chat or commit it to the repository.

The login page supports Google popup sign-in. If the Google email already belongs to an email/password account, sign in with that password once when prompted to link the methods; later sign-ins can use Google directly.

Existing Supabase accounts and passwords are not automatically transferred. Customers will need to create Firebase accounts. If you have an approved account-migration plan, existing user emails can be migrated separately, but passwords cannot be recovered from Supabase for direct copying.

## Vercel environment variables

Set these variables for the Vercel deployment and redeploy:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `apiKey` from the Firebase Web App config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` from the Firebase Web App config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `matrin-product` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `appId` from the Firebase Web App config |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL` | `https://matrin-product-default-rtdb.asia-southeast1.firebasedatabase.app/` |
| `FIREBASE_PROJECT_ID` | `matrin-product` |
| `FIREBASE_DATABASE_URL` | The Realtime Database URL above |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Full service-account JSON from Firebase; server-only |
| `ADMIN_EMAIL` | The admin account's Firebase Authentication email |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Same admin email; used to prevent public registration of the admin address |

Never use a `NEXT_PUBLIC_` prefix for the service-account key. The public Firebase Web App config is not a service-account credential.

After redeploying, open **Admin > Settings > Firebase Database** and select **Test Connection**. A first request initializes the default product/category/coupon data when those collections are empty. Supplier, employee, warehouse, notification, and security settings are not automatically seeded.

## Database layout and access

Records are stored under collection names such as `Products`, `Orders`, and `Customers`. The service account key is used only by server API routes. Do not configure public read/write database rules; API routes verify Firebase sessions and admin roles before privileged operations.

Realtime Database and Firebase Authentication must be in the same Firebase project. Google Sheets and Supabase are no longer used for application storage or sign-in after the Firebase cutover.
