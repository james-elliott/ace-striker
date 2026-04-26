"use client";

import { React, useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addPilot } from "./actions";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/src/lib/firebase/clientApp";
import { query } from "firebase/firestore";
import { useForm, useFieldArray } from "react-hook-form"
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
          {pilots.length > 0 ? pilots.map((pilot) => (
          <div  key={pilot.id}>
            <p>Name: {pilot.name}</p>
            <p>Callsign: {pilot.callsign}</p>
            <p>Type: {pilot.type}</p>
            <p>Skill: {pilot.skill}</p>
            <p>Edge Tokens: {pilot.edgeTokens}</p>
            <p>State: {pilot.state}</p>
            <p>mvp: {pilot.mvp}</p>
            <p>SP: {pilot.sp}</p>
            <p>Abilities: 
            {pilot.abilities.length > 0 ? pilot.abilities.map((ability, index) => (
              <span key={index}>{ability}</span>
            )) : ' none' }
            </p>
          </div>
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
export function AddPilotForm( props ) {
  const { control, register } = useForm();
  const router = useRouter();
  const addPilotToCampaign = addPilot.bind(null, props.campaignId);

  const [skill, setSkill] = useState(4);
  const [edgeTokens, setEdgeTokens] = useState(1);
  const [abilityCount, setAbilityCount] = useState(0);
  const [skillCost, setSkillCost] = useState(400);
  const [tokenCost, setTokenCost] = useState(60);
  const [abilityCost, setAbilityCost] = useState(60);
  const [SP, setSP] = useState(150);

  const handleClose = (e) => {
    router.back();
  };

  const improveSkill = (e) => {
    if (skill > 0 && SP >= skillCost) {
      setSkill(skill - 1);
      setSP(SP - skillCost);
      setSkillCost(500*(5-skill))
    }
  }

  const addTokens = (e) => {
    if (edgeTokens < 10 && SP >= tokenCost) {
      setEdgeTokens(edgeTokens + 1);
      setSP(SP - tokenCost);
      setTokenCost(60 + (edgeTokens-1)*20);
    }
  }

  const addAbility = (e) => {
    if (abilityCount < 5 && SP >= abilityCost) {
      setAbilityCount(abilityCount + 1);
      setSP(SP - abilityCost);
      setAbilityCost(60 + (abilityCount+1)*60)
    }
  }

  const abilities = [];
  for (let i = 0; i < abilityCount; i++) {
    abilities.push(
        <select 
          key={"ability"+i}
          {...register('abilities')}
          defaultValue={'placeholder'}
          required
          >
          <option value={''}></option>
        </select>
    );
  }

  return <form
          action={addPilotToCampaign}
          onSubmit={(e) => handleClose(e)}
        >
            <h1>New Pilot</h1>
  
            <p>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                {...register('name')}
                placeholder="Pilot's Name"
                required
              />
            </p>
            <p>
              <label htmlFor="callsign">Callsign</label>
              <input
                type="text"
                {...register('callsign')}
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

            <p>
              <label htmlFor="sp">Available SP</label>
              <input
                type="number"
                {...register('sp')}
                readOnly
                defaultValue={SP}
              />
            </p>
  
            <p>
              <label htmlFor="skill">Skill</label>
              <input
                type="number"
                name="skill"
                id="skill"
                value={skill}
                onChange={e => setSkill(e.target.value)}
                readOnly
                required
              />
              <button
                autoFocus
                type="button"
                className="button--cancel"
                disabled={skill < 1 || SP < skillCost}
                onClick={(e) => improveSkill(e)}
              >
                Improve Skill: Cost {skillCost}
              </button>
            </p>
            <p>
              <label htmlFor="edgeTokens">Edge Tokens</label>
              <input
                type="number"
                name="edgeTokens"
                id="edgeTokens"
                value={edgeTokens}
                onChange={e => setEdgeTokens(e.target.value)}
                readOnly
                required
              />
              <button
                autoFocus
                type="button"
                className="button--cancel"
                onClick={(e) => addTokens(e)}
                disabled={edgeTokens > 9 || SP < tokenCost}
              >
                Add Token: Cost {tokenCost}
              </button>
            </p>
            
            <p>
              <label htmlFor="abilityCount">Abilities</label>
              <input
                type="number"
                name="abilityCount"
                id="abilityCount"
                value={abilityCount}
                onChange={e => setAbilityCount(e.target.value)}
                readOnly
                required
              />
              <button
                autoFocus
                type="button"
                className="button--cancel"
                onClick={(e) => addAbility(e)}
                disabled={abilityCount > 4 || SP < abilityCost}
              >
                Add Ability: Cost {abilityCost}
              </button>
            </p>

            {abilities}
  
            <menu>
              <button
                autoFocus
                type="reset"
                onClick={(e) => handleClose(e)}
                className="button--cancel"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                value="confirm" 
                className="button--confirm">
                Submit
              </button>
            </menu>
        </form>;

}