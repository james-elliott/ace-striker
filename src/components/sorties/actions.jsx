"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, collection, addDoc, query, getDocs, Timestamp, doc, getDoc } from "firebase/firestore";

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
    }
  } else {
    return;
  }
}