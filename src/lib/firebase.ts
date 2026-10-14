import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 💡 [과제 2] 프로젝트 루트의 .env.local 파일을 만들고
//    Firebase Console → 프로젝트 설정 → 내 앱 → SDK 설정 및 구성 값을 채워 넣으세요.
//    (.env.local.example 파일을 복사해서 사용하면 편합니다)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Next.js의 HMR(Hot Module Replacement)로 인해 initializeApp이 중복 호출되는 것을 방지합니다.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
