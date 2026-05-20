"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, collection, addDoc, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { convertUnit } from "./utils";
import { db } from "@/src/lib/firebase/clientApp";

// Save unit to campaign force
export async function addUnit(campaignId, unitData) {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  // First we check the existing force to make sure we don't have too many duplicates of the same class or variant.
  const force = await getUnits(db, campaignId, currentUser?.uid);
  let classFilter = force.filter((unit) => unit.class == unitData.Class);
  let variantFilter = classFilter.filter((unit) => unit.variant == unitData.Variant);
  if (classFilter.length > 1) {
    console.log('Only two units of the same class allowed');
    return;
  } else if (variantFilter.length > 0) {
    console.log('Only one of the same variant allowed');
    return;
  }

  // Create the unit object
  const newUnit = convertUnit(unitData);

  // Write to the campaign's unit collection
  try {
    const docRef = collection(db, 'campaigns', campaignId, 'units');
    await addDoc(docRef, newUnit);
  } catch (e) {
    console.log("There was an error adding this unit");
    console.error("Error adding document: ", e);
  }
}

export async function removeUnit(campaignId, unit) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  try {
    const docRef = doc(db, 'campaigns', campaignId, 'units', unit.id);
    await deleteDoc(docRef);
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