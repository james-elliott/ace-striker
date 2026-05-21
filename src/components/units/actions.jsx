"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, collection, addDoc, query, getDocs, doc, deleteDoc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { convertUnit } from "./utils";
import { getCampaignById } from "../campaign/actions";
import { generateUUID } from "@/src/lib/utils/generateUUID";

// Save unit to campaign force
export async function addUnit(campaignId, unitData) {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  // Create the unit object
  const newUnit = convertUnit(unitData);
  newUnit.id = generateUUID();

  // Load the campaign so we can apply the unit's cost
  const campaign = await getCampaignById(db, campaignId, currentUser?.uid);
  const campaignUpdate = {};
  campaignUpdate.units = campaign.units ? campaign.units : [];

  // First we check the existing force to make sure we don't have too many duplicates of the same class or variant.
  if (campaign.units) {
    const classFilter = campaign.units.filter((unit) => unit.class == unitData.Class);
    const variantFilter = classFilter.filter((unit) => unit.variant == unitData.Variant);
    if (classFilter.length > 1) {
      console.log('Only two units of the same class allowed');
      return;
    } else if (variantFilter.length > 0) {
      console.log('Only one of the same variant allowed');
      return;
    }
  }

  if (campaign.status == 'preparing') {
    // If we don't have a current PV, calculate it from starting PV
    if (!campaign.currentPV) {
      campaignUpdate.currentPV = campaign.startingPV;
      for (let forceUnit of campaignUpdate.units) {
        campaignUpdate.currentPV -= forceUnit.pv;
      }
    } else {
      campaignUpdate.currentPV = campaign.currentPV;
    }
    // increment current PV
    campaignUpdate.currentPV -= newUnit.pv;
  } else {
    if (!campaign.currentSP) {
      campaignUpdate.currentSP = campaign.startingSP;
      for (let forceUnit of campaignUpdate.units) {
        campaignUpdate.currentSP -= forceUnit.pv * 40;
      }
    } else {
      campaignUpdate.currentSP = campaign.currentSP;
    }
    // increment current PV
    campaignUpdate.currentSP -= newUnit.pv * 40;
  }

  if (campaignUpdate.currentPV < 0 || campaignUpdate.currentSP < 0) {
    console.log('Insufficient funds for this unit');
    return;
  } else {
    campaignUpdate.units.push(newUnit);
  }

  // Write to campaign
  try {
    const campaignRef = doc(db, 'campaigns', campaignId);
    await setDoc(campaignRef, campaignUpdate, { merge: true });
  } catch (e) {
    console.log("There was an error adding this unit");
    console.error("Error adding document: ", e);
  }
}

export async function removeUnit(campaignId, unit) {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

    // Load the campaign so we can apply the unit's cost
  const campaign = await getCampaignById(db, campaignId, currentUser?.uid);
  const campaignUpdate = {};
  if (campaign.status == 'preparing') {
    // If we don't have a current PV, calculate it from starting PV
    if (!campaign.currentPV) {
      campaignUpdate.currentPV = campaign.startingPV;
      for (let forceUnit of campaign.units) {
        campaignUpdate.currentPV -= forceUnit.pv;
      }
    } else {
      campaignUpdate.currentPV = campaign.currentPV;
    }
    // Return PV for unit
    campaignUpdate.currentPV += unit.pv;
  } else {
    if (!campaign.currentSP) {
      campaignUpdate.currentSP = campaign.startingSP;
      for (let forceUnit of campaign.units) {
        campaignUpdate.currentSP -= forceUnit.pv * 20;
      }
    } else {
      campaignUpdate.currentSP = campaign.currentSP;
    }
    // Add sold value of unit
    campaignUpdate.currentSP += unit.pv * 20;
  }

  campaignUpdate.units = campaign.units.filter(existingUnit => existingUnit.id !== unit.id);

  try {
    const campaignRef = doc(db, 'campaigns', campaignId);
    await setDoc(campaignRef, campaignUpdate, { merge: true });
  } catch (e) {
    console.log("There was an error deleting this unit");
    console.error("Error deleting document: ", e);
  }
}

export async function getUnits(db = db, campaignId, userId) {
  if (campaignId == null) {
    console.log('Error: No campaign id');
    return;
  }
  if (userId == null) {
    console.log('Error: No user id provided to getUnits');
    return;
  }
  let q = query(collection(db, "campaigns", campaignId, "units"));

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