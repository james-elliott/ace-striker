"use client";

import { addSortie, addOpForUnit, removeUnitFromOpFor, addPlayerUnitsToSortie, removePlayerUnitFromSortie, editOpForUnit, assignPilotToPlayerUnit, startSortie } from "./actions";
import { useRouter, useParams } from "next/navigation";
import Panel from "../ui/panel/panel";
import { useForm } from "react-hook-form";
import "./sorties.css";
import { db } from "@/src/lib/firebase/clientApp";
import { query, collection, onSnapshot, doc } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { convertUnit, cachedResults } from "../units/utils";
import { getMULASSearchResults, getMULAerospaceRoles, getMULEraIDs, getMULEraLabel, getMULFactionIDs, getMULFactionLabels, getMULGroundRoles, getMULTypeIDs, getMULTypeLabel } from "@/src/lib/utils/mulUtilities";
import { PillInput } from "../ui/pills/pills";
import {  Unit } from "../units/units";
import { getCampaignSnapshotById } from "../campaign/campaign";
import { Pilot } from "../pilots/pilots";


// Get Sorties
export function getSortiesSnapshot(cb, campaignId) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }
  if (campaignId == null) {
    console.log('no campaignId to get sorties');
    return;
  }
  let q = query(collection(db, "campaigns", campaignId, 'sorties'));

  return onSnapshot(q, (querySnapshot) => {
    const results = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        // Only plain objects can be passed to Client Components from Server Components
        date: doc.data().date.toDate(),
      };
    });

    cb(results);
  });
}

export function getSortieSnapshotById(cb, campaignId, sortieId) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }
  if (campaignId == null) {
    console.log('no campaignId to get sortie');
    return;
  }
  if (sortieId == null) {
    console.log('no sortieId to get sortie');
    return;
  }

  const docRef = doc(db, "campaigns", campaignId, "sorties", sortieId);
  return onSnapshot(docRef, (docSnap) => {
    cb({
      ...docSnap.data(),
    });
  });
}

export function SortieTable( {initialSorties, campaignId} ) {
  const [sortBy, setSortBy] = useState('status');
  const [sortAsc, setSortAsc] = useState(false);
  const [sorties, setSorties] = useState(initialSorties);

  useEffect(() => {
  return getSortiesSnapshot((data) => {
    setSorties(data);
  }, campaignId);
  },[]);
  
  const handleSort = ( event, sort ) => {
    event.preventDefault();
    let asc = sortBy == sort ? !sortAsc : true;

    setSortBy(sort);
    setSortAsc(asc);
  }

  const sortResults = (sortBy, asc, data) => {
    data.sort((a, b) => {
      // Flip the values if we're not sorting by ascending
      let sortA = !asc ? b : a;
      let sortB = !asc ? a : b;

      // Sorting needs to be updated to handle nested values e.g. role.name
      let sortArray = sortBy.split('.');
      let i = 0;
      while (i < sortArray.length) {
        sortA = sortA[sortArray[i]];
        sortB = sortB[sortArray[i]];
        i++;
      }

      // Format the value for proper sorting
      if (sortA !== undefined) {
        if (isNaN(sortA)) {
          sortA = sortA.toLowerCase();
          sortB = sortB.toLowerCase();
        } else if (parseFloat(sortA)) {
          sortA = parseFloat(sortA);
          sortB = parseFloat(sortB);
        }
      }

      if (sortA < sortB) return -1;
      else if (sortA > sortB) return 1;

      return NaN;
    });

    return data;
  }

  let sortedSorties = sortResults(sortBy, sortAsc, sorties);

  let sortieRows = [];
  for (let sortie of sortedSorties) {
    sortieRows.push(
      <tr key={sortie.id}>
        <td className="right">{sortie.date.toLocaleDateString()}</td>
        <td className="right">{sortie.number}</td>
        <td><Link href={`/campaign/${campaignId}/sorties/${sortie.id}`}>{sortie.name}</Link></td>
        <td>{sortie.status}</td>
        <td className="gap"></td>
        <td>{sortie.earnings}</td>
        <td>{sortie.namedPilots}</td>
        <td>{sortie.purchases}</td>
        <td>{sortie.balance}</td>
        <td className="gap"></td>
        <td>{sortie.keywords}</td>
      </tr>
    );
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th><a href="#" onClick={(e) => handleSort(e, 'date')} className={sortBy === "date" ? sortAsc ? 'active' : 'active desc' : ''}>Date</a></th>
            <th className="right"><a href="#" onClick={(e) => handleSort(e, 'number')} className={sortBy === "number" ? sortAsc ? 'right active' : 'right active desc' : ''}>#</a></th>
            <th><a href="#" onClick={(e) => handleSort(e, 'name')} className={sortBy === "name" ? sortAsc ? 'active' : 'active desc' : ''}>Name</a></th>
            <th><a href="#" onClick={(e) => handleSort(e, 'status')} className={sortBy === "status" ? sortAsc ? 'active' : 'active desc' : ''}>State</a></th>
            <th className="gap"></th>
            <th><a href="#" onClick={(e) => handleSort(e, 'earnings')} className={sortBy === "earnings" ? sortAsc ? 'active' : 'active desc' : ''}>Earnings</a></th>
            <th><a href="#" onClick={(e) => handleSort(e, 'namedPilots')} className={sortBy === "namedPilots" ? sortAsc ? 'active' : 'active desc' : ''}>Named Pilots</a></th>
            <th><a href="#" onClick={(e) => handleSort(e, 'purchases')} className={sortBy === "purchases" ? sortAsc ? 'active' : 'active desc' : ''}>Purchases</a></th>
            <th><a href="#" onClick={(e) => handleSort(e, 'balance')} className={sortBy === "balance" ? sortAsc ? 'active' : 'active desc' : ''}>Balance</a></th>
            <th className="gap"></th>
            <th><a href="#" onClick={(e) => handleSort(e, 'keywords')} className={sortBy === "keywords" ? sortAsc ? 'active' : 'active desc' : ''}>Keywords</a></th>
          </tr>
        </thead>
        <tbody>
          { sortieRows }
        </tbody>
      </table>
    </>
  );
}

function unitsInSortie(units, sortieId) {
  return units.filter((unit) => unit.sorties ? Object.hasOwn(unit.sorties, sortieId) : false);
}

export function SortiePlayerUnitList( {forceUnits, sortieId} ) {
  const params = useParams();
  const [units, setUnits] = useState(unitsInSortie(forceUnits, sortieId));

  const removePlayerUnit = async(unit) => {
    removePlayerUnitFromSortie(params.id, sortieId, unit.id);
  }

  useEffect(() => {
    return getCampaignSnapshotById((data) => {
      setUnits(unitsInSortie(data.units, sortieId));
    }, params.id);
  },[]);

  return (
    <div className="units">
      { units?.length > 0 ? units.map((unit, unitIndex) => {
        const actions = [
          <Link key="assign" href={`/campaign/${params.id}/sorties/${sortieId}/assignPilot/${unit.id}`} className="button">Assign Pilot</Link>,
          <button key="remove" type="button" onClick={() => removePlayerUnit(unit)}>Remove</button>,
        ];

        return <Unit key={unitIndex} 
          unit={unit} 
          actions={actions}
          pilot={Object.hasOwn(unit.sorties[sortieId], 'id') ? unit.sorties[sortieId] : null}
          />
      }) : <>No units in player force</>}
    </div>
  );
}

export function OpForUnitList( {initialSortie, round} ) {
  const [units, setUnits] = useState(initialSortie?.round[round].opfor);
  const params = useParams();

  const removeOpForUnit = async(unit) => {
    removeUnitFromOpFor(params.id, params.sortieId, unit.id);
  }

  useEffect(() => {
    return getSortieSnapshotById((data) => {
      setUnits(data.round[round].opfor);
    }, params.id, params.sortieId);
  },[]);

  return (
    <div className="units">
      { units?.length > 0 ? units.map((unit, unitIndex) => {
        const actions = [
          <Link key="edit pilot" className="button" href={`/campaign/${params.id}/sorties/${params.sortieId}/editOpFor/${unit.id}`}>Edit Pilot</Link>,
          <button key="remove" type="button" onClick={() => removeOpForUnit(unit)}>Remove</button>,
        ];
        
        return <Unit key={unitIndex} 
          unit={unit} 
          actions={actions}
          />
      }) : <>No units in OpFor</>}
    </div>
  );
}

// Add sortie form
export function AddSortieForm( props ) {
  const { register } = useForm();
  const router = useRouter();
  const addSortieToCampaign = addSortie.bind(null, props.campaignId);
  const autofocus = useRef();

  const handleClose = (e) => {
    router.back();
  };

    useEffect(() => {
  autofocus.current.focus();
  }, []);

  return (
    <form
      action={addSortieToCampaign}
      onSubmit={(e) => handleClose(e)}
      className="sortie"
    >
      <Panel title="New Sortie">
        <div className="row">
          <div>
            <label htmlFor="number">Number</label>
            <input
              type="number"
              defaultValue={parseInt(props.sorties.length) + 1}
              {...register('number')}
              required
            />
          </div>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              {...register('name')}
              required
              autoFocus
              ref={autofocus}
            />
          </div>
        </div>
      </Panel>
      
      <menu className="actions">
        <button 
          type="submit" 
          value="confirm"
        >
          Submit
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

export function SelectPlayerUnitsForSortieForm( {campaignId, sortieId, forceUnits}) {
  const router = useRouter();
  const units = forceUnits.filter((unit) => unit.sorties ? !Object.hasOwn(unit.sorties, sortieId) : true);
  const [selectedUnitIDs, setSelectedUnitIDs] = useState([]);

  const handleSelection = (e, unit) => {
    if (e.target.tagName == "BUTTON") {
      console.log('aborting because it\'s a button');
      return;
    }
    let newSelection = [...selectedUnitIDs];
    if (newSelection.includes(unit.id)) {
      newSelection = newSelection.filter(item => item != unit.id);
    } else {
      newSelection.push(unit.id);
    }
    setSelectedUnitIDs(newSelection);
  }

  const handleSubmit = (e) => {
    addPlayerUnitsToSortie(campaignId, sortieId, selectedUnitIDs);
    handleClose();
  }

  const handleClose = (e) => {
    router.back();
  }

  return (
    <form action={handleSubmit}>
      <Panel title="Select Units For Sortie">
        <div className="units">
          {units?.length > 0 ? units.map((unit, unitIndex) => {
            return <Unit key={unitIndex} 
              unit={unit} 
              className={selectedUnitIDs.includes(unit.id) ? 'active' : '' }
              onClick={(e)=> handleSelection(e, unit)}
              />
          }) : <span>No additional units available</span> }
        </div>
      </Panel>
      <menu className="actions">
        <button 
          type="submit" 
          value="confirm"
          disabled={selectedUnitIDs.length < 1}
        >
          Select Units
        </button>
        <button
          type="reset"
          onClick={(e) => handleClose(e)}
        >
          Cancel
        </button>
      </menu>
    </form>
  )
}

export function AddOpForToSortieForm( {campaignId, sortieId} ) {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState(cachedResults);
  const [searchSort, setSearchSort] = useState('Name');
  const [sortAsc, setSortAsc] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [rules, setRules] = useState('');
  const [tech, setTech] = useState('');
  const [role, setRole] = useState([]);
  const [era, setEra] = useState('');
  const [type, setType] = useState([18, 19, 21]);
  const [factions, setFactions] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState();
  const [pilot, setPilot] = useState({skill: 4});
  const autofocus = useRef();

  let lastSearchId = null;

  const handleSubmit = (unit) => {
    if (unit) {
      addOpForUnit(campaignId, sortieId, unit, pilot);
      router.back();
    }
  }

  const handleSelection = (event, unit) => {
    if (event.target.tagName == "BUTTON") {
      console.log('aborting because it\'s a button');
      return;
    }
    if (selectedUnit !== unit) {
      setPilot({skill: pilot.skill, behavior: unit.Role.Name})
      setSelectedUnit(unit);
    } else {
      setSelectedUnit();
    }
  }

  const handleClose = (e) => {
    window.history.back();
  };

  const getRoleOptions = () => {
    let defaultRoles = []
    if ([18,19,20,21,23,24].some((role) => type.includes(role))) {
      defaultRoles =  getMULGroundRoles();
    }
    if (type.includes(17)) {
      defaultRoles =  defaultRoles.concat(getMULAerospaceRoles());
    }
    return defaultRoles;
  }

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      updateSearchResults();
    }, 800);

    return () => {
      clearTimeout(searchTimeout);
    }
  }, [search]);

  useEffect(() => {
    updateSearchResults();
  }, [rules, tech, era, type, role, factions]);

  useEffect(() => {
    autofocus.current.focus();
  }, []);

  const updateRules = ( event ) => {
    setRules(event.currentTarget.value);
  }

  const updateTech = ( event ) => {
    setTech(event.currentTarget.value);
  }

  const updateEra = ( event ) => {
    setEra(event.currentTarget.value);
  }

  const updateType = ( newTypes ) => {
    setType(newTypes);
  }

  const updateRole = ( newRoles ) => {
    setRole(newRoles);
  }

  const renderRole = ( name ) => {
    let rendered = name;
    if (type.includes(17) && type.length > 1) {
      if (getMULGroundRoles().includes(name)) {
        // prepend a ground icon
        rendered = '🦿 ' + name;
      } else if (getMULAerospaceRoles().includes(name)) {
        // Prepend a aero icon
        rendered = '✈ ' + name;
      }
    }
    return rendered;
  }

  const updatePilot = (event, attr) => {
    let newPilot = {...pilot};
    newPilot[attr] = event.currentTarget.value;
    setPilot(newPilot);
  }

  const skillOptions = [];
  for (let i = 0; i < 9; i++) {
    skillOptions.push(<option key={i} value={i}>{i}</option>);
  }

  const getBehaviorOptions = () => {
    const behaviorOptions = [];
    if (selectedUnit && selectedUnit.Type.Id == 17) {
      getMULAerospaceRoles().map((role, index) => {
        behaviorOptions.push(<option key={index} value={role}>{role}</option>)
      });
    } else {
      getMULGroundRoles().map((role, index) => {
        behaviorOptions.push(<option key={index} value={role}>{role}</option>)
      });
    }
    return behaviorOptions;
  }

  const updateFactions = (newFactions) => {
    setFactions(newFactions);
  }

  const handleSort = ( sortBy, asc = true ) => {
    if (searchSort == sortBy) {
      asc = !sortAsc;
    }

    let data = sortResults(sortBy, asc, searchResults);

    setSearchSort(sortBy);
    setSortAsc(asc);
    setSearchResults(data);
  }

  const sortResults = (sortBy, asc, data) => {
    data.sort((a, b) => {
      const secondarySort = sortBy === 'Name'
          ? 'BFPointValue'
          : 'Name';

      let sortA = !asc ? b : a;
      let sortB = !asc ? a : b;

      // Sorting needs to be updated to handle nested values e.g. role.name
      let sortArray = sortBy.split('.');
      let i = 0;
      while (i < sortArray.length) {
        sortA = sortA[sortArray[i]];
        sortB = sortB[sortArray[i]];
        i++;
      }

      /* primary sort */
      if (sortA < sortB) return -1;
      else if (sortA > sortB) return 1;

      /* fallback sort to break primary sort ties */
      if (a[secondarySort] < b[secondarySort]) return -1;
      else if (a[secondarySort] > b[secondarySort]) return 1;

      return 0;
    });

    return data;
  }

  const updateSearchResults = async () => {
    if (search.length < 3) {
      console.log("Not enough characters to search");
      return;
    }

    let currentSearchId = generateUUID();

    lastSearchId = currentSearchId;
    setIsSearching(true);

    try {
      let data = await getMULASSearchResults(
        search,
        rules,
        tech,
        role,
        era,
        type,
        factions,
        !navigator.onLine,
        false,
        {},
      );

      if(lastSearchId !== currentSearchId) {
        console.log("updateSearchResults: searchId mismatch, aborting");
        // // Don't set isSearching to false here - a newer search is running
        return;
      }

      data = sortResults(searchSort, sortAsc, data);

      setSearchResults(data);
      setIsSearching(false);

    } catch (error) {
      console.error("Search failed:", error);
      // Only turn off loading if this was the most recent search
      if(lastSearchId === currentSearchId) {
        setIsSearching(false);
      }
    }
  }

  return <>
    <form className="unit" action={() => handleSubmit(selectedUnit)}>
      <Panel title="Add Unit to Sortie OpFor" style={{'--primary-color': "#B82327"}}>
        <div>
          We integrate with the <a href="http://masterunitlist.info/" target="_blank">Master Unit List</a> to make sure that all the stats are as official and as up to date as possible.
        </div>
        <div className="row">

            <label>Search
              <input
                type="search"
                onChange={(e) => setSearch(e.currentTarget.value)}
                value={search}
                autoFocus
                ref={autofocus}
              />
            </label>
        </div>

        <details>
          <summary>Advanced Search</summary>

        <div className="column">
        <div className="row">
          
            <label>
              Search Rules
              <select
                onChange={updateRules}
                value={rules}
              >
                <option value="">All</option>
                <option value="introductory">Introductory</option>
                <option value="standard">Standard</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            <label>
              Search Tech
              <select
                onChange={updateTech}
                value={tech}
              >
                <option value="">All</option>
                <option value="inner sphere">Inner Sphere</option>
                <option value="clan">Clan</option>
              </select>
            </label>

            <label>
              Era
              <select
                onChange={updateEra}
                value={era}
              >
                <option value="">All</option>
                {getMULEraIDs().map( (eraID ) => {
                  return <option key={eraID} value={eraID}>{getMULEraLabel( eraID )}</option>
                })}
              </select>
            </label>

        </div>

        <div className="row">
          <label>
            Type
            <PillInput id="type" onUpdate={updateType} selected={type} options={getMULTypeIDs()} optionsCB={getMULTypeLabel} showAll={true} />
          </label>

          <label>
            Role
            <PillInput id="role" onUpdate={updateRole} selected={role} options={getRoleOptions()} optionsCB={renderRole} showAll={true}/>
          </label>
        </div>

        <div className="row">
          <label>Filter Availability By Factions
            <PillInput id="factions" onUpdate={updateFactions} selected={factions} options={getMULFactionIDs()} optionsCB={getMULFactionLabels} />
          </label>
        </div></div>
        </details>

      <h3>Search Results ({isSearching ? '...' : searchResults.length})</h3>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th><a href="#" onClick={(e) => handleSort('Name')} className={searchSort === "Name" ? sortAsc ? 'active' : 'active desc' : ''}>Name</a></th>
              <th><a href="#" onClick={(e) => handleSort('Rules')} className={searchSort === "Rules" ? sortAsc ? 'active' : 'active desc' : ''}>Rules</a></th>
              <th><a href="#" onClick={(e) => handleSort('Technology.Name')} className={searchSort === "Technology.Name" ? sortAsc ? 'active' : 'active desc' : ''}>Tech</a></th>
              <th><a href="#" onClick={(e) => handleSort('EraStart')} className={searchSort === "EraStart" ? sortAsc ? 'active' : 'active desc' : ''}>Era</a></th>
              <th><a href="#" onClick={(e) => handleSort('BFType')} className={searchSort === "BFType" ? sortAsc ? 'active' : 'active desc' : ''}>Type</a></th>
              <th><a href="#" onClick={(e) => handleSort('Role.Name')} className={searchSort === "Role.Name" ? sortAsc ? 'active' : 'active desc' : ''}>Role</a></th>
              <th><a href="#" onClick={(e) => handleSort('BFPointValue')} className={searchSort === "BFPointValue" ? sortAsc ? 'active' : 'active desc' : ''}>Points</a></th>
            </tr>
          </thead>
        </table>

        {searchResults.length > 0 ? (
          <div className="units column">
            {searchResults.map( (asUnit, unitIndex) => {
              let unit = convertUnit(asUnit);
              return (
                <Unit unit={unit} key={unitIndex} 
                  className={selectedUnit == asUnit ? 'active' : null } 
                  onClick={(e) => handleSelection(e, asUnit)}
                  wide={true}
                  />
              )
            })}
          </div>
        ) : null }
      </div>

      <h3>Unit Pilot</h3>
      <div className="row">
        <label>Pilot Skill
          <select
            value={pilot.skill}
            onChange={(e) => updatePilot(e, 'skill')}
            disabled={!selectedUnit}
            >
            {skillOptions}
          </select>
        </label>
        <label>Behavior
          <select
            value={pilot.behavior ? pilot.behavior : selectedUnit?.Role?.Name}
            onChange={(e) => updatePilot(e, 'behavior')}
            disabled={!selectedUnit}
            >
            {getBehaviorOptions()}
          </select>
        </label>
      </div>

    </Panel>
      <menu className="actions">
        <button 
          type="submit" 
          value="confirm"
          disabled={!selectedUnit}
        >
          Add Unit
        </button>
        <button
          type="reset"
          onClick={(e) => handleClose(e)}
        >
          Cancel
        </button>
      </menu>
    </form>
  </>
}

export function EditOpForForm( {campaignId, sortieId, unitId, initialUnit}) {
  const router = useRouter();
  const [pilot, setPilot] = useState(initialUnit.pilot ? initialUnit.pilot : {skill: 4, behavior: initialUnit.role})

  const updatePilot = (event, attr) => {
    let newPilot = {...pilot};
    newPilot[attr] = event.currentTarget.value;
    setPilot(newPilot);
  }

  const handleSubmit = (e) => {
    editOpForUnit(campaignId, sortieId, unitId, pilot);
    handleClose();
  }
  const handleClose = (e) => {
    router.back();
  }

  const skillOptions = [];
  for (let i = 0; i < 9; i++) {
    skillOptions.push(<option key={i} value={i}>{i}</option>);
  }

  const roleOptions = [];
  if (initialUnit.isGround) {
    getMULGroundRoles().map((role, index) => {
      roleOptions.push(<option key={index} value={role}>{role}</option>)
    })
  }

  return (
    <form action={handleSubmit}>
      <Panel title={'Edit ' + initialUnit.name}>
        <div className="column">
          <div className="row">
            <label>Pilot Skill
              <select
                value={pilot.skill}
                onChange={(e) => updatePilot(e, 'skill')}
                >
                {skillOptions}
              </select>
            </label>
            <label>Behavior
              <select
                value={pilot.behavior}
                onChange={(e) => updatePilot(e, 'behavior')}
                >
                {roleOptions}
              </select>
            </label>
          </div>
          <Unit unit={initialUnit} pilot={null} wide={true} />
        </div>
      </Panel>
      <menu className="actions">
        <button 
          type="submit" 
          value="confirm"
        >
          Save
        </button>
        <button
          type="reset"
          onClick={(e) => handleClose(e)}
        >
          Cancel
        </button>
      </menu>
    </form>
  )
}

export function AssignPlayerPilotForm( {campaignId, sortieId, unit, forcePilots}) {
  const router = useRouter();
  const [selectedPilot, setSelectedPilot] = useState(unit.sorties[sortieId].pilot);
  const [forceCommander, setForceCommander] = useState(selectedPilot?.forceCommander);
  
  const handleSelection = (event, pilot) => {
    if (event.target.tagName == "BUTTON") {
      console.log('aborting because it\'s a button');
      return;
    }
    setSelectedPilot(pilot);
  }

  const toggleForceCommander = (event) => {
    setForceCommander(event.target.value);
  }

  const handleSubmit = (e) => {
    const finalPilot = selectedPilot;
    finalPilot.forceCommander = forceCommander;
    assignPilotToPlayerUnit(campaignId, sortieId, unit.id, selectedPilot);
    handleClose();
  }
  const handleClose = (e) => {
    router.back();
  }

  return (
    <form action={handleSubmit}>
      <Panel title={"Add Pilot to " + unit.name}>
        <div className="pilots">
          {forcePilots?.length > 0 ? forcePilots.map((pilot, pilotIndex) => {
            return <Pilot key={pilotIndex} 
              pilot={pilot} 
              className={selectedPilot && selectedPilot.id == pilot.id ? 'active' : '' }
              onClick={(e)=> handleSelection(e, pilot)}
              />
          }) : <span>No pilots available</span> }
        </div>
        <label>Assign to Force Commander role
          <input 
            type="checkbox"
            defaultValue={forceCommander}
            onChange={toggleForceCommander}
            />
        </label>
      </Panel>
      <menu className="actions">
        <button 
          type="submit" 
          value="confirm"
          disabled={!selectedPilot}
        >
          Assign Pilot
        </button>
        <button
          type="reset"
          onClick={(e) => handleClose(e)}
        >
          Cancel
        </button>
      </menu>
    </form>
  )
}

export function SortieStartButton({campaignId, campaign, sortieId, sortie}) {
  const [playerUnits, setPlayerUnits] = useState(unitsInSortie(campaign.units, sortieId));
  const [opForUnits, setOpForUnits] = useState(sortie.round[0].opfor);

  useEffect(() => {
    return getCampaignSnapshotById((data) => {
      setPlayerUnits(unitsInSortie(data.units, sortieId));
    }, campaignId);
  },[]);

  useEffect(() => {
    return getSortieSnapshotById((data) => {
      setOpForUnits(data.round[0].opfor);
    }, campaignId, sortieId);
  },[]);

  return (
    <button
      className="button"
      type="button"
      disabled={playerUnits.length < 1 || opForUnits.length < 1}
      onClick={() => startSortie(campaignId, sortieId)}
    >Start Sortie</button>
  );
}