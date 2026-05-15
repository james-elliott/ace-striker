"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, setDoc } from "firebase/firestore";
import { doc, collection, runTransaction, Timestamp, addDoc, query, getDocs, where, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function addCampaign(initiatalState, formData) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const newCampaign = {
    name: formData.get('name'),
    forceName: formData.get('forceName'),
    users: [formData.get("userId")],
    startingPV: Number(formData.get("startingPV")),
    startingSP: Number(formData.get("startingSP")),
    difficulty: Number(formData.get("difficulty")),
    status: 'preparing',
  }
  let docRef = {};
  try {
    docRef = await addDoc(
      collection(db, "campaigns"),
      newCampaign
    );
    
    // await setDoc(doc(db, "campaigns", docRef.id, "users", formData.get("userId")), {});
    // await addDoc(collection(db, "campaigns", docRef.id, "users"), {userId: formData.get("userId")});

  } catch (e) {
    console.log("There was an error adding the document");
    console.error("Error adding document: ", e);
  }
  if (docRef && docRef.id) {
    revalidatePath('/');
    redirect('/campaign/' + docRef.id + '/roster');
  }
}

export async function getCampaigns(db = db, userId) {
  if (userId == null) {
    console.log('Error: No user id provided to getCampaigns');
    return;
  }
  let q = query(collection(db, "campaigns"));
  q = query(q, where("users", "array-contains", userId));

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
}

export async function getCampaignById(db, campaignId, userId) {
  if (!campaignId) {
    console.log("Error: Invalid Campaign ID received to getCampaignById: ", campaignId);
    return;
  }
  if (!userId) {
    console.log("Error: No userId provided to getCampaignById: ", userId);
    return;
  }

  const docRef = doc(db, "campaigns", campaignId);
  const docSnap = await getDoc(docRef);
  if (docSnap.data()) {
    return {
      ...docSnap.data(),
    }
  } else {
    return;
  }
}
