"use client";

import Link from "next/link";
import { React, useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  query,
  doc,
  where,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase/clientApp";
import { addCampaign } from "./actions.js";
import "./campaign.css";
import Panel from "../ui/panel/panel.jsx";
import { SortieTable } from "../sorties/sorties.jsx";

export function CampaignList({initialCampaigns, initialUser}) {
  
  const userId = initialUser.uid;

  const [campaigns, setCampaigns] = useState(initialCampaigns);

  useEffect(() => {
    return getCampaignsSnapshot((data) => {
      setCampaigns(data);
    }, userId);
  },[]);

  return (
    <div>
      <ul className="campaigns">
        {campaigns.length > 0 ? campaigns.map((campaign) => (
          <li key={campaign.id}>
            <Link href={campaign.status == 'preparing' ? `/campaign/${campaign.id}/roster` : `/campaign/${campaign.id}`}>
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
    </div>
  );
}

export function Campaign( {campaignId, initialSorties} ) {

  return (
    <Panel title="Campaign Sorties" action={<Link href={`/campaign/${campaignId}/addSortie`}>Add Sortie</Link>}>
      <div className="row">
        <SortieTable initialSorties={initialSorties} campaignId={campaignId} />
      </div>
    </Panel>
  );
}

export function CampaignResources( {initialCampaign, campaignId} ) {

  const [campaign, setCampaign] = useState(initialCampaign);

  useEffect(() => {
    return getCampaignSnapshotById((data) => {
      setCampaign(data);
    }, campaignId);
  },[]);


  let resource = campaign.status == 'preparing' ? 
    "Remaining PV for starting units: " + (campaign.currentPV >= 0 ? campaign.currentPV : campaign.startingPV)
    : 
    "SP: " + (campaign.currentSP >= 0 ? campaign.currentSP : campaign.startingSP);
  
    return <div id="sp-display">{resource}</div>;
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
      };
    });

    cb(results);
  });
}

export function getCampaignSnapshotById(cb, campaignId) {
  if (!campaignId) {
    console.log("Error: Invalid Campaign ID received in getCampaignSnapshotById: ", campaignId);
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
          className="campaign"
        >
          <Panel title="New Campaign">
  
            <div className="row">
              <div>
                <label htmlFor="name">Campaign Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name this campaign"
                  required
                />
              </div>
              <div>
                <label htmlFor="forceName">Force Name</label>
                <input
                  type="text"
                  name="forceName"
                  id="forceName"
                  placeholder="Choose a name for the company in this campaign"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div>
                <label htmlFor="startingPV">Starting Unit Point Value</label>
                <input
                  type="number"
                  name="startingPV"
                  id="startingPV"
                  placeholder="Set a maximum PV to start the campaign"
                  defaultValue={400}
                  required
                />
              </div>
              <div>
                <label htmlFor="startingSP">Starting Supply Points</label>
                <input
                  type="number"
                  name="startingSP"
                  id="startingSP"
                  placeholder="Set the initial Supply Points you will have"
                  defaultValue={400}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="difficulty">Difficulty</label>
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
            </div>

            <div>
            </div>
  
            <input type="hidden" name="userId" value={initialState.userId.user} />
            </Panel>
            <menu className="actions">
              <button 
                type="submit" 
                value="confirm" 
                disabled={pending}
                className="button--confirm">
                Submit
              </button>
              <button
                autoFocus
                type="reset"
                onClick={(e) => handleClose(e)}
                disabled={pending}
                className="button--cancel"
              >
                Cancel
              </button>
            </menu>
            
        </form>;

}
