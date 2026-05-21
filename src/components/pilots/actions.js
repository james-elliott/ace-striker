"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, collection, query, getDocs, doc, setDoc } from "firebase/firestore";
import { getPilotSkill, getPilotTokens } from "./utils";
import { generateUUID } from "@/src/lib/utils/generateUUID";
import { getCampaignById } from "../campaign/actions";

export async function addPilot(campaignId, formData) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  // Create the pilot object
  const newPilot = {
    id: generateUUID(),
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

    // Check to make sure we are below the pilot limit
  const campaign = await getCampaignById(db, campaignId);
  if (!campaign.pilots) {
    campaign.pilots = [newPilot];
  } else if (campaign.pilots.length >= 6) {
    console.log('Only 6 named pilots can be added to a campaign.')
    return;
  } else {
    campaign.pilots.push(newPilot);
  }

  // Update the campaign
  try {
    const docRef = doc(db, 'campaigns', campaignId);
    await setDoc(docRef, { pilots: campaign.pilots }, { merge: true });
  } catch (e) {
    console.log("There was an error adding pilot");
    console.error("Error adding document: ", e);
  }
}

export async function removePilot(campaignId, pilot) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const campaign = await getCampaignById(db, campaignId);
  const pilots = campaign.pilots.filter(existingPilot => existingPilot.id !== pilot.id);

  try {
    const docRef = doc(db, 'campaigns', campaignId);
    await setDoc(docRef, { pilots: pilots }, { merge: true });
  } catch (e) {
    console.log("There was an error removing this pilot");
    console.error("Error deleting document: ", e);
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
      // timestamp: doc.data().timestamp.toDate(),
    };
  });
}
