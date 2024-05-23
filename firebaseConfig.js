import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASYOIlG-BPYl7G_XBq1w_yaIbarBoqU38",
  authDomain: "camelldrive-c5fa6.firebaseapp.com",
  projectId: "camelldrive-c5fa6",
  storageBucket: "camelldrive-c5fa6.appspot.com",
  messagingSenderId: "795983066430",
  appId: "1:795983066430:web:bd7ceeab6b25db95ece86f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// iOS 클리언트 ID 795983066430-0d5a3vj9i2ncmt384icemckb714bcdqc.apps.googleusercontent.com
// Android 클리언트 ID 795983066430-dqnfl5gkppmlvs364sb4jhemmf2c9cq4.apps.googleusercontent.com