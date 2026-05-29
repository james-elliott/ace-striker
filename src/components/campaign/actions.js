"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, setDoc } from "firebase/firestore";
import { doc, collection, Timestamp, addDoc, query, getDocs, where, getDoc } from "firebase/firestore";
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
  newCampaign.currentPV = newCampaign.startingPV;
  newCampaign.currentSP = newCampaign.startingSP;
  let docRef = {};
  try {
    docRef = await addDoc(
      collection(db, "campaigns"),
      newCampaign
    );

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

export async function getCampaignById(db, campaignId) {
  if (!campaignId) {
    console.log("Error: Invalid Campaign ID received to getCampaignById: ", campaignId);
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
