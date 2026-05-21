"use client";

import { React, useState, useEffect, useRef, Fragment } from "react";
import { useRouter } from "next/navigation";
import { addPilot, removePilot } from "./actions";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/src/lib/firebase/clientApp";
import { useForm } from "react-hook-form"
import { CONST_EDGE_ABILITIES } from "../../lib/data/edge-abilities";
import "./pilots.css";
import { StatPair, StatBox } from "../ui/stats/stats";
import Panel from "../ui/panel/panel";
import { SPslider } from "../ui/sliders/sliders";
import { getPilotSkill, getPilotTokens } from "./utils";
import { getCampaignSnapshotById } from "../campaign/campaign";

// Pilot Listing
export function PilotList({initialPilots, campaignId, perPilotActions}) {
  const [pilots, setPilots] = useState(initialPilots);

  useEffect(() => {
    return getCampaignSnapshotById((data) => {
      setPilots(data.pilots);
    }, campaignId);
  },[]);

  return (
    <ul className="pilots">
      {pilots?.length > 0 ? pilots.map((pilot, pilotIndex) => {
        return <Pilot key={pilotIndex} pilot={pilot} actions={perPilotActions} />
      }) : <span>No Pilots</span> }
    </ul>
  );
}

export function Pilot( {pilot, onClick, actions} ) {
  const popover = useRef();
  const popoverAnchor = useRef();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    popover.current.togglePopover({source: popoverAnchor.current});
  }

  let abilities = [];

  for (let name of pilot.abilities) {
    let ability = getPilotAbility(name);
    abilities.push(
      <Fragment key={ability.name}>
        <button className="link" type="button" popoverTarget={ability.name + "-popover"} popoverTargetAction="toggle">{ability.name}</button>
        <div popover="auto" id={ability.name+"-popover"}>
          <h4>{ability.name}</h4>
          <div className="type">{ability.type}<span>{ability.restrictions}</span></div>
          <p>
            <em>{ability.condition}:</em> {ability.description}
          </p>
        </div>
      </Fragment>);
  }

  return (
    <div key={pilot.id} className="pilot" onClick={actions ? (e) => handleClick(e) : null} ref={popoverAnchor}>
      <div className="row">
        <div className="portrait">
          <img src={pilot.pic ? pilot.pic : '/pilots/001.png'}></img>
        </div>
        <div className="expand">
          <div className="row">
            <div><span className="class" title={pilot.name}>{pilot.callsign}</span></div>
            <StatPair label="Type" values={pilot.type}/>
          </div>
          <div className="row">
            <StatBox label="Skill">{pilot.skill}</StatBox>
            <StatBox label="Tokens"><img src="/token.png" />{pilot.edgeTokens}</StatBox>
            <StatBox label="Abilities">{pilot.abilities.length}</StatBox>
          </div>
        </div>
      </div>
      <div className="row">
        <StatPair label="Total SP" values={pilot.pilotSP}/>
        <StatPair label="MVPs" values={pilot.mvp}/>
        <StatPair label="Status" values={pilot.status}/>
      </div>
      <div className="abilities">
        {abilities}
      </div>
      
    {actions?.length > 0 ? 
      <div className="actions" id={pilot.id + "-actions"} popover="auto" ref={popover}>
        {actions.map((action, index) => {
          // Create the actions
          return <button key={index} type="button" onClick={() => action.cb(pilot)}>{action.name}</button>
        })}
      </div> : null }
    </div>
  );
}

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

export function getPilotAbility(name) {
  if (CONST_EDGE_ABILITIES[name]) {
    return CONST_EDGE_ABILITIES[name];
  }
}

// Get Pilots


// Add pilot form
export function AddPilotForm( {campaignId} ) {
  const { register } = useForm();
  const router = useRouter();
  const addPilotToCampaign = addPilot.bind(null, campaignId);

  const [abilityCount, setAbilityCount] = useState(0);
  const [pilotSP, setPilotSP] = useState(150);
  const [skillSP, setSkillSP] = useState(0);
  const [tokenSP, setTokenSP] = useState(0);
  const [abilitySP, setAbilitySP] = useState(0);
  const [pic, setPic] = useState('/pilots/001.png');
  const picSelector = useRef();

  const handleClose = (e) => {
    router.back();
  };

  const togglePicSelector = (e) => {
    picSelector.current.togglePopover();
  }

  const changeSkillSP = (e) => {
    if (pilotSP >= parseInt(e.target.value) + parseInt(abilitySP) + parseInt(tokenSP)) {
      setSkillSP(e.target.value);
    } else {
      setSkillSP(parseInt(pilotSP) - parseInt(abilitySP) - parseInt(tokenSP))
    }
  }

  const changeTokenSP = (e) => {
    if (pilotSP > parseInt(e.target.value) + parseInt(abilitySP) + parseInt(skillSP)) {
      setTokenSP(e.target.value);
    } else {
      setTokenSP(parseInt(pilotSP) - parseInt(skillSP) - parseInt(abilitySP))
    }
  }

  const changeAbilitySP = (e) => {
    if (pilotSP > parseInt(e.target.value) + parseInt(tokenSP) + parseInt(skillSP)) {
      setAbilitySP(e.target.value);

      if (e.target.value >= 900) {
        setAbilityCount(5);
      } else if (e.target.value >= 600) {
        setAbilityCount(4);
      } else if (e.target.value >= 360) {
        setAbilityCount(3);
      } else if (e.target.value >= 180) {
        setAbilityCount(2);
      } else if (e.target.value >= 60) {
        setAbilityCount(1);
      } else {
        setAbilityCount(0);
      }
    } else {
      setAbilitySP(parseInt(pilotSP) - parseInt(skillSP) - parseInt(tokenSP));
    }
  }

  const tokenDisplay = () => {
    const tokens = {'tokenSP': tokenSP};

    return (<>
      <img src="/token.png" />
      {getPilotTokens(tokens)}
    </>);
  }

  const abilityList = [<option key=""></option>];
  for (var abilityId in CONST_EDGE_ABILITIES) {
    abilityList.push(<option key={abilityId} value={abilityId}>{CONST_EDGE_ABILITIES[abilityId].name}</option>);
  }

  const abilities = [];
  for (let i = 0; i < 5; i++) {
    abilities.push(
        <select 
          key={"ability"+i}
          {...register('abilities')}
          defaultValue={'placeholder'}
          disabled={abilityCount - 1 < i}
          required
          >
            {abilityList}
        </select>
    );
  }

  const pics = [];
  const formatter = Intl.NumberFormat('en-US', {
    minimumIntegerDigits: 3
  });
  for (let i = 1; i <= 8; i++) {
    let url = '/pilots/' + formatter.format(i) + '.png';

    pics.push(
      <label  key={i} onChange={(e) => setPic(e.target.value)} className="portrait">
        <input name='pic' type="radio" value={url} defaultChecked={url == pic}/>
        <img src={url} onClick={togglePicSelector} />
      </label>
    );
  }

  return (
    <form
      action={addPilotToCampaign}
      onSubmit={(e) => handleClose(e)}
      className="pilot"
    >
      <Panel title="New Pilot">
        <div className="row">
          <div>
            <label htmlFor="pic-selector">Portrait</label>
            <div className="portrait-wrapper" onClick={togglePicSelector}>
              <button className="portrait" type="button">
                <img src={pic} />
              </button>
              <div id="pic-selector" className="pic-selector" popover="auto" ref={picSelector}>
                {pics}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="callsign">Callsign</label>
            <input
              type="text"
              {...register('callsign')}
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              {...register('name')}
              required
            />
          </div>
          <div>
            <label htmlFor="type">Type</label>
            <select id="type"
              defaultValue={'BM'}
              name="type"
              >
              <option value={'BM'}>BattleMech</option>
              <option value={'CV'}>Combat Vehicle</option>
              <option value={'BA'}>Battle Armor</option>
            </select>
          </div>
        </div>

          <div className="row end">
            <span>Total SP: {pilotSP}</span>
          </div>
          <div className="sp-sliders">

            <SPslider 
              id="pilotSP"
              label="Skill"
              value={skillSP}
              onChange={changeSkillSP}
              displayValue={getPilotSkill({'skillSP': skillSP})}
              steps={[
                {label: 3, value: 400},
                {label: 2, value: 900},
                {label: 1, value: 1900},
                {label: 0, value: 3400},
              ]}
            />

            <SPslider 
              id="tokenSP"
              label="Tokens"
              value={tokenSP}
              onChange={changeTokenSP}
              displayValue={tokenDisplay()}
              steps={[
                {label: 2, value: 60},
                {label: 3, value: 120},
                {label: 4, value: 200},
                {label: 5, value: 300},
                {label: 6, value: 420},
                {label: 7, value: 560},
                {label: 8, value: 720},
                {label: 9, value: 900},
                {label: 10, value: 1100},
              ]}
            />

            <SPslider 
              id="abilityCount"
              label="Abilities"
              value={abilitySP}
              onChange={changeAbilitySP}
              displayValue={abilityCount}
              steps={[
                {label: 1, value: 60},
                {label: 2, value: 180},
                {label: 3, value: 360},
                {label: 4, value: 600},
                {label: 5, value: 900},
              ]}
            />

            <div className="ability-selectors">
              {abilities}
            </div>
          </div>

      </Panel>
      
      <menu className="actions">
        <button 
          type="submit" 
          value="confirm"
          disabled={pilotSP !== skillSP + tokenSP + abilitySP}
        >
          Add Pilot
        </button>
        <button
          type="reset"
          onClick={(e) => handleClose(e)}
        >
          Cancel
        </button>
      </menu>

    </form>
  );

}