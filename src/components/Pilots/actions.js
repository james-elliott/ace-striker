"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, setDoc } from "firebase/firestore";
import { doc, collection, runTransaction, Timestamp, addDoc, query, getDocs, where, getDoc } from "firebase/firestore";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function addCampaign(initiatalState, formData) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const newCampaign = {
    name: formData.get('name'),
    users: [formData.get("userId")],
    startingBV: Number(formData.get("startingBV")),
    startingSP: Number(formData.get("startingSP")),
    difficulty: Number(formData.get("difficulty")),
  }
  let docRef = {};
  try {
    docRef = await addDoc(
      collection(db, "campaigns"),
      newCampaign
    );
    
    await setDoc(doc(db, "campaigns", docRef.id, "users", formData.get("userId")), {});

  } catch (e) {
    console.log("There was an error adding the document");
    console.error("Error adding document: ", e);
  }
  if (docRef && docRef.id) {
    revalidatePath('/');
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
