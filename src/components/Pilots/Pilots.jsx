"use client";

import { React, useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addPilot } from "./actions";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/src/lib/firebase/clientApp";
import { query } from "firebase/firestore";
import Link from "next/link";

// Pilot Listing
export function PilotList({initialPilots, campaignId}) {

  const [pilots, setPilots] = useState(initialPilots);

  useEffect(() => {
    return getPilotsSnapshot((data) => {
      setPilots(data);
    }, campaignId);
  },[]);

  return (
    <>
      <ul className="pilots">
          {pilots.length > 0 ? pilots.map((pilots) => (
          <li key={pilots.id}>
              {pilots.name}
          </li>
        )) : <span>No Pilots</span> }
      </ul>
    </>
  );
}

// Get Pilots
export function getPilotsSnapshot(cb, campaignId) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }
  if (campaignId == null) {
    console.log('no campaign id');
    return;
  }
  let q = query(collection(db, "campaigns", campaignId, 'pilots'));

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

// Pilot Card

// Add pilot form
// Use the context injector to add the CampaignId instead of a hidden form field
export function AddPilotForm( initialState ) {
  const [state, formAction, pending] = useActionState(addPilot, initialState);
  const router = useRouter();

  const [skill, setSkill] = useState(4);
  const [edgeTokens, setEdgeTokens] = useState(1);
  const [abilityCount, setAbilityCount] = useState(0);

  const handleClose = (e) => {
    router.back();
  };

  const improveSkill = (e) => {
    if (skill > 0) {
      setSkill(skill - 1);
    }
  }

  const addTokens = (e) => {
    if (edgeTokens < 10) {
      setEdgeTokens(edgeTokens + 1);
    }
  }

  const addAbility = (e) => {
    if (abilityCount < 5) {
      setAbilityCount(abilityCount + 1);
    }
  }

  const abilities = [];
  for (let i = 0; i < abilityCount; i++) {
    abilities.push(
        <select 
          key={"ability"+i}
          id={"ability"+i}
          defaultValue={'BM'}
          name={"ability"+i}
          >
          <option value={'BM'}>   </option>
          <option value={'CV'}>Combat Vehicle</option>
          <option value={'BA'}>Battle Armor</option>
        </select>
    );
  }

  return <form
          action={formAction}
          onSubmit={(e) => handleClose(e)}
        >
            <h1>New Pilot</h1>
  
            <p>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Pilot's Name"
                required
              />
            </p>
            <p>
              <input
                type="text"
                name="callsign"
                id="callsign"
                placeholder="Pilot's Callsign"
                required
              />
            </p>
            <p>
              <select id="type"
                defaultValue={'BM'}
                name="type"
                >
                <option value={'BM'}>BattleMech</option>
                <option value={'CV'}>Combat Vehicle</option>
                <option value={'BA'}>Battle Armor</option>
              </select>
            </p>

            <p>Total SP: 150</p>
  
            <p>
              <input
                type="number"
                name="skill"
                id="skill"
                value={skill}
                disabled
                required
              />
              <button
                autoFocus
                type="reset"
                className="button--cancel"
                disabled={skill < 1 || pending}
                onClick={(e) => improveSkill(e)}
              >
                Improve Skill
              </button>
            </p>
            <p>
              <input
                type="number"
                name="edgeTokens"
                id="edgeTokens"
                value={edgeTokens}
                disabled
                required
              />
              <button
                autoFocus
                type="reset"
                className="button--cancel"
                onClick={(e) => addTokens(e)}
                disabled={edgeTokens > 9}
              >
                Add Token
              </button>
            </p>
            
            <p>
              <input
                type="number"
                name="abilities"
                id="abilities"
                value={abilityCount}
                disabled
                required
              />
              <button
                autoFocus
                type="reset"
                className="button--cancel"
                onClick={(e) => addAbility(e)}
              >
                Add Ability
              </button>
            </p>

            {abilities}
  
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