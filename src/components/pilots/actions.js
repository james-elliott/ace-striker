"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, collection, addDoc, query, getDocs } from "firebase/firestore";

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
    pilotSP: 150,
    pic: formData.get('pic'),
    skillSP: formData.get('skillSP'),
    tokenSP: formData.get('tokenSP'),
    abilitySP: formData.get('abilitySP'),
    status: 'ready',
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