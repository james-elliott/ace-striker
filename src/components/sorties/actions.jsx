"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, collection, addDoc, query, getDocs, setDoc, Timestamp, doc, getDoc } from "firebase/firestore";
import { convertUnit } from "../units/utils";
import { generateUUID } from "@/src/lib/utils/generateUUID";
import { getCampaignById } from "../campaign/actions";

export async function addSortie(campaignId, formData) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  // Create the sortie object
  const newSortie = {
    number: formData.get("number"),
    name: formData.get("name"),
    date: new Date(),
    status: 'not started',
  }

  // Write to the sortie collection
  try {
    const docRef = collection(db, 'campaigns', campaignId, 'sorties');
    await addDoc(docRef, newSortie);
  } catch (e) {
    console.log("There was an error adding the document");
    console.error("Error adding document: ", e);
  }
}

export async function addPlayerUnitsToSortie(campaignId, sortieId, selectedUnitIDs) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const campaign = await getCampaignById(db, campaignId);
  const forceUnits = campaign.units;

  forceUnits.map((unit, index) => {
    if (selectedUnitIDs.includes(unit.id)) {
      if (forceUnits[index].sorties) {
        forceUnits[index].sorties[sortieId] = {};
      } else {
        forceUnits[index].sorties = {[sortieId]: {}};
      }
    }
  });

  try {
    const docRef = doc(db, 'campaigns', campaignId);
    await setDoc(docRef, { units: forceUnits }, { merge: true });
  } catch (e) {
    console.log("There was an error adding units to this sortie");
    console.error("Error adding document: ", e);
  }
}

export async function removePlayerUnitFromSortie(campaignId, sortieId, unitId) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const campaign = await getCampaignById(db, campaignId);
  const forceUnits = campaign.units;

  forceUnits.map((unit, index) => {
    if (unit.id == unitId && unit.sorties[sortieId]) {
      delete forceUnits[index].sorties[sortieId];
    }
  });

  try {
    const docRef = doc(db, 'campaigns', campaignId);
    await setDoc(docRef, { units: forceUnits }, { merge: true });
  } catch (e) {
    console.log("There was an error removing unit from this sortie");
    console.error("Error adding document: ", e);
  }
}

export async function assignPilotToPlayerUnit(campaignId, sortieId, unitId, pilot) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const campaign = await getCampaignById(db, campaignId);
  const forceUnits = campaign.units;

  forceUnits.map((unit, index) => {
    if (unit.sorties && unit.sorties[sortieId]) {
      // Remove the pilot from any other units it might be assigned to for this sortie
      if (unit.sorties[sortieId].id == pilot.id) {
        forceUnits[index].sorties[sortieId] = {};
      }
      if (unit.id == unitId) {
        forceUnits[index].sorties[sortieId] = pilot;
      }
    }
  });

  try {
    const docRef = doc(db, 'campaigns', campaignId);
    await setDoc(docRef, { units: forceUnits }, { merge: true });
  } catch (e) {
    console.log("There was an error assigning a pilot to this unit");
    console.error("Error adding document: ", e);
  }
}

export async function addOpForUnit(campaignId, sortieId, unitData, pilotData, round = 0) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  // Create the unit object
  const newUnit = convertUnit(unitData);
  newUnit.id = generateUUID();
  newUnit.pilot = pilotData ? pilotData : {
    skill: 4,
    behavior: newUnit.role,
  };
  
  // Add the opfor to the sortie
  const sortie = await getSortieById(db, campaignId, sortieId);
  if (sortie.round && sortie.round[round] && sortie.round[round].opfor) {
    // Add the unit to the specific round
    sortie.round[round].opfor.push(newUnit);
  } else if (sortie.round) {
    // We have a round array, but no opfor array, create opfor
    sortie.round[round].opfor = [newUnit];
  } else {
    // We don't even have a round array, create it and the opfor array
    sortie.round = [{opfor: [newUnit]}]
  }

  try {
    const docRef = doc(db, 'campaigns', campaignId, 'sorties', sortieId);
    await setDoc(docRef, { round: sortie.round }, { merge: true });
  } catch (e) {
    console.log("There was an error adding unit to OpFor");
    console.error("Error adding document: ", e);
  }
}

export async function editOpForUnit(campaignId, sortieId, unitId, pilot) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);
  
  const sortie = await getSortieById(db, campaignId, sortieId);
  if (!sortie.opfor) {
    return;
  } else {
    const index = sortie.opfor.findIndex((opUnit) => opUnit.id == unitId);
    if (index > -1) {
      sortie.opfor[index].pilot = pilot;
    }
  }

  try {
    const docRef = doc(db, 'campaigns', campaignId, 'sorties', sortieId);
    await setDoc(docRef, { opfor: sortie.opfor }, { merge: true });
  } catch (e) {
    console.log("There was an error adding unit to OpFor");
    console.error("Error adding document: ", e);
  }
}

export async function removeUnitFromOpFor(campaignId, sortieId, unitId, round = 0) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const sortie = await getSortieById(db, campaignId, sortieId);

  sortie.round[round].opfor = sortie.round[round].opfor.filter(unit => unit.id !== unitId);

  try {
    const docRef = doc(db, 'campaigns', campaignId, 'sorties', sortieId);
    await setDoc(docRef, { round: sortie.round }, { merge: true });
  } catch (e) {
    console.log("There was an error removing unit from OpFor");
    console.error("Error adding document: ", e);
  }
}

export async function getSorties(db = db, campaignId) {
  if (campaignId == null) {
    console.log('Error: No campaign id');
    return;
  }
  let q = query(collection(db, "campaigns", campaignId, "sorties"));

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      date: doc.data().date.toDate(),
    };
  });
}

export async function getSortieById(db, campaignId, sortieId) {
  if (campaignId == null) {
    console.log('getSortie Error: No campaign id');
    return;
  }
  if (sortieId == null) {
    console.log('getSortie Error: No sortie id');
    return;
  }

  const docRef = doc(db, "campaigns", campaignId, "sorties", sortieId);
  const docSnap = await getDoc(docRef);
  if (docSnap.data()) {
    return {
      ...docSnap.data(),
      date: docSnap.data().date.toDate(),
    }
  } else {
    return;
  }
}

export async function startSortie(campaignId, sortieId) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const campaign = await getCampaignById(db, campaignId);
  const sortie = await getSortieById(db, campaignId, sortieId);

  console.log('campaign', campaign);
  console.log('sortie', sortie);
  console.log(sortie.round[0]);
  // Copy the selected player force to sortie round 0
  // Use a single iteration loop, so we can also set the current values for mutable stats
  // Give each unit without a pilot a fake pilot with skill 4 and 0 edgeTokens

  // Check to see if the campaign is started
  // If not, start it. Checking here to not redundantly start it will save on db writes.
}