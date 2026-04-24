"use client";

// This components handles the Campaign objects
// It receives data from src/app/page.jsx, such as the initial campaigns and search params from the URL

import Link from "next/link";
import { React, useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
  getFirestore,
} from "firebase/firestore";
import { db, auth } from "@/src/lib/firebase/clientApp";
import { addCampaign } from "./actions.js";

export function CampaignList({initialCampaigns, initialUser}) {
  
  const userId = initialUser.uid;

  const [campaigns, setCampaigns] = useState(initialCampaigns);

  useEffect(() => {
    return getCampaignsSnapshot((data) => {
      setCampaigns(data);
    }, userId);
  },[]);

  return (
    <>
      <ul className="campaigns">
        {campaigns.length > 0 ? campaigns.map((campaign) => (
          <li key={campaign.id}>
            <Link href={`/campaign/${campaign.id}`}>
              {campaign.name}
            </Link>
          </li>
        )) : <span>No campaigns</span> }
      </ul>
      <hr />
      <Link 
        href="/addCampaign">
        New Campaign
      </Link>
    </>
  );
}

export function getCampaignsSnapshot(cb, uid) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }
  if (uid == null) {
    console.log('no user id');
    return;
  }
  let q = query(collection(db, "campaigns"));

  // Here we can filter the query to only return campaigns that the user owns.
  q = query(q, where("users", "array-contains", uid));

  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        timestamp: doc.data().timestamp?.toDate(),
      };
    });

    cb(results);
  });
}

export function Campaign({
  id,
  initialCampaign,
  initialUserId,
  children,
}) {
  const [campaign, setCampaign] = useState(initialCampaign);


  useEffect(() => {
    return getCampaignSnapshotById(id, (data) => {
      setCampaign(data);
    });
  }, [id]);

  return (
    <>
      <p>This is the campaign: {campaign.name}</p>
      <p>difficulty: {campaign.difficulty}</p>
      <p>startingBV: {campaign.startingBV}</p>
      <p>startingSP: {campaign.startingSP}</p>
    </>
  );
}

export function getCampaignSnapshotById(campaignId, cb) {
  if (!campaignId) {
    console.log("Error: Invalid Campaign ID received: ", campaignId);
    return;
  }

  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  const docRef = doc(db, "campaigns", campaignId);
  return onSnapshot(docRef, (docSnap) => {
    cb({
      ...docSnap.data(),
      // timestamp: docSnap.data().timestamp.toDate(),
    });
  });
}

export function AddCampaignForm( initialState ) {
  const [state, formAction, pending] = useActionState(addCampaign, initialState);
  const router = useRouter();

  const handleClose = (e) => {
    if (e.type == 'click') {
      router.back();
    }
  };

  return <form
          action={formAction}
          onSubmit={(e) => handleClose(e)}
        >
            <h1>New Campaign</h1>
  
            <p>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Name this campaign"
                required
              />
            </p>
  
            <p>
              <input
                type="text"
                name="startingBV"
                id="startingBV"
                placeholder="Set a maximum BV to start the campaign"
                defaultValue={400}
                required
              />
            </p>
            <p>
              <input
                type="text"
                name="startingSP"
                id="startingSP"
                placeholder="Set the initial Supply Points you will have"
                defaultValue={400}
                required
              />
            </p>
            <p>
              <select id="difficulty"
                defaultValue={1.0}
                name="difficulty"
                >
                <option value={1.2}>Rookie</option>
                <option value={1.0}>Standard</option>
                <option value={0.9}>Veteran</option>
                <option value={0.8}>Elite</option>
                <option value={0.7}>Legendary</option>
              </select>
            </p>
  
            <input type="hidden" name="userId" value={initialState.userId.user} />
            <menu>
              <button
                autoFocus
                type="reset"
                onClick={(e) => handleClose(e)}
                disabled={pending}
                className="button--cancel"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                value="confirm" 
                disabled={pending}
                className="button--confirm">
                Submit
              </button>
            </menu>
        </form>;

}
