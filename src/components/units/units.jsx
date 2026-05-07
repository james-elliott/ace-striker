"use client";

import { getMULASSearchResults } from "@/src/lib/utils/mulUtilities";
import { getMULAerospaceRoles, getMULEraIDs, getMULEraLabel, getMULFactionIDs, getMULFactionLabels, getMULGroundRoles, getMULTypeIDs, getMULTypeLabel } from "@/src/lib/utils/mulUtilities";
import { generateUUID } from "@/src/lib/utils/generateUUID";
import { useEffect, useState, Fragment } from "react";
import { addUnit, getUnits } from "./actions";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/src/lib/firebase/clientApp";
import Link from "next/link";
import { StatPair } from "../ui/stats/stats";
import "./unit.css";
import { CONST_AS_SPECIAL_ABILITIES } from "@/src/lib/data/alpha-strike-abilities";

export function ForceList({initialUnits, campaignId}) {

  const [units, setUnits] = useState(initialUnits);

  useEffect(() => {
    return getUnitsSnapshot((data) => {
      setUnits(data);
    }, campaignId);
  },[]);

  return (
    <>
      <ul className="units">
          {units.length > 0 ? units.map((unit) => Unit(unit)) : <span>No Units</span> }
      </ul>
    </>
  );
}

const getTMM = (unit) => {
  if (!unit.isGround) {
    return 4;
  }
  let tmm = [];
  unit.movement.map((movementType, index) => {
    let tempTMM = 0;

    if (movementType.move < 5) {
      tempTMM = 0;
    } else if (movementType.move < 9) {
      tempTMM = 1;
    } else if (movementType.move < 13) {
      tempTMM = 2;
    } else if (movementType.move < 19) {
      tempTMM = 3;
    } else if (movementType.move < 35) {
      tempTMM = 4;
    } else {
      tempTMM = 5;
    }

    if (index > 0) {
      tempTMM = tempTMM + movementType.type;
    }

    tmm.push(<em key={index}>{tempTMM}</em>);
  });
  return tmm;
}

const getHealth = (unit) => {
  let armorPips = [];
  let structurePips = [];
  let columns = '';
  let columnCount = unit.armor < unit.structure ? unit.structure : unit.armor;


  for(let i = 0; i < columnCount; i++) {
    if (i < unit.armor) {
      armorPips.push(<a key={i} href="">{i+1}</a>);
    }
    if (i < unit.structure) {
      structurePips.push(<a key={i} href="">{i+1}</a>);
    }
    columns += "1fr ";
  }

  return <div className="health">
    <span className="material-symbols-outlined">shield</span>
    <div className="pips">
      <div className="armor">{armorPips}</div>
      <div className="structure">{structurePips}</div>
    </div>
  </div>
}

const getDamage = (unit) => {
  return <div className="damage">
    <span className="material-symbols-outlined">explosion</span> 
    <span className="stat">
      {unit.damage.length > 0 ? unit.damage.map((attack, index) => (
        <em key={index} className={attack.range}>{attack.value}{attack.minimal ? '*' : null} </em>
      )) : ' none' }
    </span>
  </div>;
}

const getUnitAbility = (tag) => {
  for( let def of CONST_AS_SPECIAL_ABILITIES ) {
    if( tag.toLowerCase().trim() === def.tag.toLowerCase().trim() ) {
      let newDef = JSON.parse(JSON.stringify(def));
      newDef.rawTag = tag;
      return newDef;
    }
    if(def.tag.indexOf("%") > 0) {
      let baseTag = def.tag.substring(0, def.tag.indexOf("%") ).toLowerCase();

      if( tag.toLowerCase().startsWith(baseTag) ) {
        let newDef = JSON.parse(JSON.stringify(def));
        newDef.rawTag = tag;
        return newDef;
      }
    }
    if(def.tag.indexOf("#") > 0) {
      let baseTag = def.tag.substring(0, def.tag.indexOf("#") ).toLowerCase();
      if( tag.toLowerCase().startsWith(baseTag) ) {
        let tmp = tag.toLowerCase().replace(baseTag, "");
        if( tmp.length > 0 ) {
          if( !Number.isNaN(Number(tmp[0])) ) {
            let newDef = JSON.parse(JSON.stringify(def));
            newDef.rawTag = tag;
            return newDef;
          }
        }
      }
    }
  }
  return null;
}

export function Unit( unit ) {
  let abilities = [];
  
  for (let name of unit.abilities) {
    let ability = getUnitAbility(name);
    if (ability) {
      abilities.push(
        <Fragment key={ability.rawTag}>
          <button className="link" type="button" popoverTarget={ability.rawTag + "-popover"} popoverTargetAction="toggle">{ability.rawTag}</button>
          <div popover="auto" id={ability.rawTag+"-popover"}>
            <h4>{ability.name}</h4>
            <div className="type">{ability.tag}<span>page {ability.asce_page}</span></div>
            {ability.summary.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </Fragment>);
    }
  }

  return <div key={unit.id} className="unit">
    <div className="data">
      <div className="">
        <span className="class">{unit.class}</span> <span className="variant">{unit.variant}</span>
      </div>
      <div className="row">
        <span className="stat">Type: <em>{unit.type}</em></span>
        <span className="stat">MV:&nbsp; 
            {unit.movement.length > 0 ? unit.movement.map((movement, index) => (
              <em key={index}>{movement.move}{movement.type != 'g' ? movement.type : null}</em> 
            )) : ' none' }
          </span>
        <StatPair label="TMM" values={getTMM(unit)} />
        <span className="stat">Size: <em>{unit.size}</em></span>
      </div>
      <div className="combat row">
        {getHealth(unit)}
        {getDamage(unit)}
        <span className="stat">OV: <em>{unit.overheat}</em></span>
      </div>
      <div className="abilities">
        {abilities}
      </div>
    </div>
    <img src={unit.imageURL} />
    <div className="pv">{unit.pv}</div>
  </div>;
}

// Get Units
export function getUnitsSnapshot(cb, campaignId) {
  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }
  if (campaignId == null) {
    console.log('no campaign id');
    return;
  }
  let q = query(collection(db, "campaigns", campaignId, 'units'));

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

export function AddUnitForm( props ) {

  const [searchResults, setSearchResults] = useState([]);
  const [searchSort, setSearchSort] = useState('Name');
  const [sortAsc, setSortAsc] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [rules, setRules] = useState('');
  const [tech, setTech] = useState('');
  const [role, setRole] = useState('');
  const [era, setEra] = useState('');
  const [type, setType] = useState([18, 19, 21]);
  const [factionSearch, setFactionSearch] = useState('');
  const [factionSuggestions, setFactionSuggestions] = useState([]);
  const [factions, setFactions] = useState([]);

  let lastSearchId = null;

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
  }, [rules, tech, era, type, factions]);

  const updateRules = ( event ) => {
    setRules(event.currentTarget.value);
  }

  const updateTech = ( event ) => {
    setTech(event.currentTarget.value);
  }

  const updateRole = ( event ) => {
    setRole(event.currentTarget.value);
  }

  const updateEra = ( event ) => {
    setEra(event.currentTarget.value);
  }

  const updateType = ( event ) => {

    let newOptions = [];
    if (event.target.selectedOptions.length > 0) {
      for ( let option of event.target.selectedOptions) {
        newOptions.push(parseInt(option.value));
      }
    }

    setType(newOptions);
  }

  const updateFactionSearch = ( event ) => {
      setFactionSearch(event.currentTarget.value);

      let searchValue = event.currentTarget.value;
      if( searchValue.length < 3 ) {
        setFactionSuggestions([]);
        return;
      }

      let arrFound = [];
      for( let factionID of getMULFactionIDs() ) {
        if( getMULFactionLabels(factionID).toLowerCase().includes( searchValue.toLowerCase() ) ) {
          arrFound.push( factionID  );
        }
      }
      setFactionSuggestions(arrFound);
  }

  const addFactionSelected = ( factionID ) => {
    if( factions.includes( factionID ) ) {
      return;
    }
    
    let newFactions = [];
    for (let faction of factions) {
      newFactions.push(faction);
    }
    newFactions.push( factionID );
    setFactions(newFactions);
  }

  const removeFactionSelected = ( factionID ) => {
    let newFactions = factions.filter( (faction) => faction !== factionID );
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

      //   console.log("updateSearchResults data", data);
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
    <div className="col">
      <h2>Search for Units</h2>
      <div className="small-text text-center">
        We integrate with the <a href="http://masterunitlist.info/" target="_blank">Master Unit List</a> to make sure that all the stats are as official and as up to date as possible.
      </div>
      <fieldset className="fieldset">
        <div className="row">

          <div className="col-md-6 text-center">
            <input
                  type="search"
                  onChange={(e) => setSearch(e.currentTarget.value)}
                  value={search}
                  label="Search Terms"
            />
          </div>

          <div className="col-md-6 text-center">
            <label>
              Search Rules:<br />
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
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 text-center">
            <label>
              Search Tech:<br />
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
              Type:<br />
              <select
                onChange={updateType}
                value={type}
                multiple
              >
                <option value="">All</option>
                {getMULTypeIDs().map( (typeID ) => {
                  return <option key={typeID} value={typeID}>{getMULTypeLabel( typeID )}</option>
                })}
              </select>
            </label>
          </div>

          <div className="col-md-6 text-center">
            <label>
              Era:<br />
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

            <label>
              Role:<br />
              <select
                onChange={updateRole}
                value={role}
              >
                <option value="">All</option>
                { type.includes(18) && type.includes(17) ? (
                  <>
                    <optgroup label="Ground Unit Roles">
                    {getMULGroundRoles().map( (role, roleIndex ) => {
                      return <option key={roleIndex} value={role}>{role}</option>
                    })}
                    </optgroup>
                    <optgroup label="Aerospace Roles">
                    {getMULAerospaceRoles().map( (role, roleIndex ) => {
                      return <option key={roleIndex} value={role}>{role}</option>
                    })}
                    </optgroup>
                  </>
                ) : getMULGroundRoles().map( (role, roleIndex ) => {
                      return <option key={roleIndex} value={role}>{role}</option>
                    }) }


              </select>
            </label>
          </div>
        </div>
                     
        <div className="row">
          <div className="col-md-12 text-center">
            <input
                type="search"
                onChange={updateFactionSearch}
                value={factionSearch}
                label="Filter Availability By Factions"
                placeholder='Type 3 or more characters to search. MUL uses OR logic for multiple factions.'
              />
          </div>

          <div className="col-md-6 text-center">
            {factionSuggestions.length > 0 ? (
              <label htmlFor="factionFilter">
                Add to Faction Filter?<br />
                {factionSuggestions.map( (factionID, index) => { 
                  return <div key={factionID+index} className="text-left"><button onClick={() => addFactionSelected(factionID)} className="btn-sm btn btn-primary">Add</button>&nbsp;{getMULFactionLabels(factionID)}</div>
                })}
              </label>
            ) : null}
          </div>

          <div className="col-md-6 text-center">
            {factions.length > 0 ? (
              <label htmlFor="factionFilter">
                Current Faction Filter:<br />
                {factions.map( (factionID, index) => { 
                  return <div key={factionID + index} className="text-left"><button onClick={() => removeFactionSelected(factionID)} className="btn btn-sm btn-danger">Remove</button>{getMULFactionLabels(factionID)}</div>
                })}
              </label>
            ):null}
          </div>
        </div>
                  
      </fieldset>

      <h3 className="text-center">
        Search Results ({isSearching ? '...' : searchResults.length})
      </h3>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th onClick={(e) => handleSort('Name')} className={searchSort === "Name" ? sortAsc ? 'active' : 'active desc' : ''}>Name</th>
              <th onClick={(e) => handleSort('Rules')} className={searchSort === "Rules" ? sortAsc ? 'active' : 'active desc' : ''}>Rules</th>
              <th onClick={(e) => handleSort('Technology.Name')} className={searchSort === "Technology.Name" ? sortAsc ? 'active' : 'active desc' : ''}>Tech</th>
              <th onClick={(e) => handleSort('EraStart')} className={searchSort === "EraStart" ? sortAsc ? 'active' : 'active desc' : ''}>Era</th>
              <th onClick={(e) => handleSort('BFType')} className={searchSort === "BFType" ? sortAsc ? 'active' : 'active desc' : ''}>Type</th>
              <th onClick={(e) => handleSort('BFPointValue')} className={searchSort === "BFPointValue" ? sortAsc ? 'active' : 'active desc' : ''}>Points</th>

            </tr>
            <tr>
              <th>&nbsp;</th>
              <th colSpan={4}>Notes</th>
              <th colSpan={2} onClick={(e) => handleSort('Role.Name')} className={searchSort === "Role.Name" ? sortAsc ? 'active' : 'active desc' : ''}>Role</th>
            </tr>
          </thead>

          {isSearching ? (
            <tbody>
              <tr>
                <td className="text-center" colSpan={7}>
                  <div className="text-muted">
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Searching Master Unit List...
                  </div>
                </td>
              </tr>
            </tbody>
          ) : searchResults.length > 0 ? (
            <>
              {searchResults.map( (asUnit, unitIndex) => {

                return (
                  <tbody key={unitIndex}>
                    <tr>
                      <td>{asUnit.Name} <a href="#" onClick={(e) => addUnit(props.campaignId, asUnit)}>Add Unit</a></td>

                      <td>{asUnit.Rules}</td>
                      <td>{asUnit.Technology.Name}</td>
                      <td>{getMULEraLabel(asUnit.EraId)}</td>
                      <td>{asUnit.BFType}</td>
                      <td>{asUnit.BFPointValue}</td>

                    </tr>
                    <tr>
                      <td colSpan={4} className=" text-left">
                        <strong title="Move">MV</strong>: {asUnit.BFMove}
                        &nbsp;|&nbsp;<strong title="Armor/Internal Structure values">A/IS</strong>: {asUnit.BFArmor}/{asUnit.BFStructure}
                        &nbsp;|&nbsp;<strong title="Alpha Strike Damage Bands">Damage</strong>: {asUnit.BFDamageShort}/{asUnit.BFDamageMedium}/{asUnit.BFDamageLong}
                        {asUnit.BFOverheat  && asUnit.BFOverheat > 0 ? (
                          <>
                          &nbsp;|&nbsp;<strong title="Overheat Value">OHV</strong>: {asUnit.BFOverheat}
                          </>
                        ) : null}
                        {asUnit.BFAbilities && asUnit.BFAbilities.trim() ? (
                          <>
                            &nbsp;|&nbsp;<strong title="Special Abilities">Special</strong>: {asUnit.BFAbilities}
                          </>
                        ) : null}

                      </td>
                      <td colSpan={3} className=" text-left">
                        {asUnit.Role.Name}
                      </td>
                    </tr>
                  </tbody>
                )
              })}
            </>
          ) : (
            <>
            {search.length < 3 ? (
              <tbody>
                <tr>
                  <td className="text-center" colSpan={7}>
                    Please type a search term 3 or more characters.
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td className="text-center" colSpan={7}>
                    Sorry, there are no matches with those parameters. It is a remote possibility that the MUL is down if other searches don't work.
                  </td>
                </tr>
              </tbody>
            )}
            </>
          )}

        </table>
      </div>
    </div>
  </>

}