"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, collection, addDoc, query, getDocs, Timestamp } from "firebase/firestore";

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

export async function getSorties(db = db, campaignId, userId) {
  if (campaignId == null) {
    console.log('Error: No campaign id');
    return;
  }
  if (userId == null) {
    console.log('Error: No user id provided to getPilots');
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