"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, setDoc } from "firebase/firestore";
import { doc, collection, runTransaction, Timestamp, addDoc, query, getDocs, where, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Use the context injector to add the CampaignId instead of a hidden form field
export async function addPilot(campaignId, formData) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  // Create the pilot object
  const newPilot = {
    name: formData.get("name"),
    callsign: formData.get("callsign"),
    type: formData.get("type"),
    skill: Number(formData.get("skill")),
    edgeTokens: Number(formData.get("edgeTokens")),
    abilities: formData.getAll('abilities'),
    sp: formData.get('sp'),
    state: 'ready',
    mvp: 0,
  }

  // Write to the pilot collection
  try {
    const docRef = collection(db, 'campaigns', campaignId, 'pilots');
    await addDoc(docRef, newPilot);
  } catch (e) {
    console.log("There was an error adding the document");
    console.error("Error adding document: ", e);
  }
}

export async function getPilots(db = db, campaignId) {
  if (campaignId == null) {
    console.log('Error: No campaign id');
    return;
  }
  let q = query(collection(db, "campaigns", campaignId, "pilots"));

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