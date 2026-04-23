"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, setDoc } from "firebase/firestore";
import { doc, collection, runTransaction, Timestamp, addDoc, query, getDocs, where, getDoc } from "firebase/firestore";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { redirect } from "next/navigation";

// This is a Server Action
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
// Replace the function below
export async function handleCampaignDialogSubmission(data) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const newCampaign = {
    name: data.get('name'),
    users: [data.get("userId")],
    startingBV: Number(data.get("startingBV")),
    startingSP: Number(data.get("startingSP")),
    difficulty: Number(data.get("difficulty")),
  }
  let docRef = {};
  try {
    docRef = await addDoc(
      collection(db, "campaigns"),
      newCampaign
    );
    
    await setDoc(doc(db, "campaigns", docRef.id, "users", data.get("userId")), {});

  } catch (e) {
    console.log("There was an error adding the document");
    console.error("Error adding document: ", e);
  }
  if (docRef && docRef.id) {
    console.log('redirecting');
    redirect('/campaign/' + docRef.id);
  }
}

export async function getCampaigns(db = db, userId) {
  if (userId == null) {
    console.log('Error: No user id');
    return;
  }
  let q = query(collection(db, "campaigns"));//.where("owner", "==", userId));
  q = query(q, where("users", "array-contains", userId));

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      //timestamp: doc.data().timestamp.toDate(),
    };
  });
}

export async function getCampaignById(db, campaignId, userId) {
  if (!campaignId) {
    console.log("Error: Invalid Campaign ID received: ", campaignId);
    return;
  }

  const docRef = doc(db, "campaigns", campaignId);
  const docSnap = await getDoc(docRef);
  return {
    ...docSnap.data(),
    // timestamp: docSnap.data().timestamp.toDate(),
  };
}
