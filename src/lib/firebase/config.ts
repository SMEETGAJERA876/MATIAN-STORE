export const firebaseWebConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyAqLbS68RiuP2NIYmhQuY-Mx9Az1PTLgJs",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "matrin-product.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "matrin-product",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:672459082355:web:5499be245c8ccfed853806",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://matrin-product-default-rtdb.asia-southeast1.firebasedatabase.app/",
};
