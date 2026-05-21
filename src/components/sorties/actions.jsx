"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, collection, addDoc, query, getDocs, setDoc, Timestamp, doc, getDoc } from "firebase/firestore";
import { convertUnit } from "../units/utils";
import { generateUUID } from "@/src/lib/utils/generateUUID";

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

export async function addOpForUnit(campaignId, sortieId, unitData) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  // Create the unit object
  const newUnit = convertUnit(unitData);
  newUnit.id = generateUUID();
  
  // Add the opfor to the sortie
  const sortie = await getSortieById(db, campaignId, sortieId);
  if (!sortie.opfor) {
    sortie.opfor = [newUnit];
  } else {
    sortie.opfor.push(newUnit);
  }

  try {
    const docRef = doc(db, 'campaigns', campaignId, 'sorties', sortieId);
    await setDoc(docRef, { opfor: sortie.opfor }, { merge: true });
  } catch (e) {
    console.log("There was an error adding unit to OpFor");
    console.error("Error adding document: ", e);
  }
}

export async function removeUnitFromSortie(campaignId, sortieId, unitId, force) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  const sortie = await getSortieById(db, campaignId, sortieId);

  let newForce = {};
  newForce[force] = sortie[force].filter(unit => unit.id !== unitId);

  try {
    const docRef = doc(db, 'campaigns', campaignId, 'sorties', sortieId);
    await setDoc(docRef, newForce, { merge: true });
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