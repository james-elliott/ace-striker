// enforces that this code can only be called on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only";

import { cookies } from "next/headers";
import { initializeServerApp, initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCa4oxyx0fVATJEz8E0JpX0IFIBjXMYFKg",
  authDomain: "james-battletech-tools.firebaseapp.com",
  projectId: "james-battletech-tools",
  storageBucket: "james-battletech-tools.firebasestorage.app",
  messagingSenderId: "532949047230",
  appId: "1:532949047230:web:17bb1c65dac2e0b3d9cbef"
};

// Returns an authenticated client SDK instance for use in Server Side Rendering
// and Static Site Generation
export async function getAuthenticatedAppForUser() {
  const authIdToken = (await cookies()).get("__session")?.value;

  // Firebase Server App is a new feature in the JS SDK that allows you to
  // instantiate the SDK with credentials retrieved from the client & has
  // other affordances for use in server environments.
  const firebaseServerApp = initializeServerApp(
    // https://github.com/firebase/firebase-js-sdk/issues/8863#issuecomment-2751401913
    initializeApp(firebaseConfig),
    {
      authIdToken,
    }
  );

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  if (process.env.NODE_ENV === 'development') {
    connectFirestoreEmulator(getFirestore(firebaseServerApp), '127.0.0.1', 8080);
    connectStorageEmulator(getStorage(firebaseServerApp), '127.0.0.1', 9199);
  }

  return { firebaseServerApp, currentUser: auth.currentUser };
}
