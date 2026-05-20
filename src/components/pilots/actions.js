"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, collection, addDoc, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { getPilotSkill, getPilotTokens } from "./utils";

export async function addPilot(campaignId, formData) {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  // Check to make sure we are below the pilot limit
  const pilots = await getPilots(db, campaignId, currentUser?.uid);
  if (pilots.length >= 6) {
    console.log('Only 6 named pilots can be added to a campaign.')
    return;
  }

  // Create the pilot object
  const newPilot = {
    name: formData.get("name"),
    callsign: formData.get("callsign"),
    type: formData.get("type"),
    skill: getPilotSkill({skillSP: formData.get('skillSP')}),
    edgeTokens: getPilotTokens({tokenSP: formData.get('tokenSP')}),
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
    console.log("There was an error adding pilot");
    console.error("Error adding document: ", e);
  }
}

export async function removePilot(campaignId, pilot) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  console.log(pilot);

  try {
    const docRef = doc(db, 'campaigns', campaignId, 'pilots', pilot.id);
    await deleteDoc(docRef);
  } catch (e) {
    console.log("There was an error removing this pilot");
    console.error("Error deleting document: ", e);
  }
}

export async function getPilots(db = db, campaignId, userId) {
  if (campaignId == null) {
    console.log('Error: No campaign id');
    return;
  }
  if (userId == null) {
    console.log('Error: No user id provided to getPilots');
    return;
  }
  let q = query(collection(db, "campaigns", campaignId, "pilots"));

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      // timestamp: doc.data().timestamp.toDate(),
    };
  });
}
