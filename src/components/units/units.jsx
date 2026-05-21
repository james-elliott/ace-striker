"use client";

import { getMULASSearchResults, getMULAerospaceRoles, getMULEraIDs, getMULEraLabel, getMULFactionIDs, getMULFactionLabels, getMULGroundRoles, getMULTypeIDs, getMULTypeLabel } from "@/src/lib/utils/mulUtilities";
import { generateUUID } from "@/src/lib/utils/generateUUID";
import { useEffect, useState, Fragment, useRef } from "react";
import { addUnit, removeUnit } from "./actions";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/src/lib/firebase/clientApp";
import { StatPair } from "../ui/stats/stats";
import "./unit.css";
import { CONST_AS_SPECIAL_ABILITIES } from "@/src/lib/data/alpha-strike-abilities";
import Panel from "../ui/panel/panel";
import { PillInput } from "../ui/pills/pills";
import { useRouter } from "next/navigation";
import { convertUnit, cachedResults } from "./utils";
import { getCampaignSnapshotById } from "../campaign/campaign";

export function ForceList({initialUnits, campaignId, perUnitActions}) {

  const [units, setUnits] = useState(initialUnits);

  useEffect(() => {
    return getCampaignSnapshotById((data) => {
      setUnits(data.units);
    }, campaignId);
  },[]);

  return (
    <div className="units">
      {units?.length > 0 ? units.map((unit, unitIndex) => {
        return <Unit key={unitIndex} 
          unit={unit} 
          actions={perUnitActions}
          />
      }) : <span>No Units</span> }
    </div>
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

const getMoves = (unit) => {
  const moves = [];
  if (unit.movement.length > 0) {
    unit.movement.map((movement) => {
      moves.push(movement.move + (movement.type != 'g' ? movement.type : null))
    });
  }
  return moves;
}

const getHealth = (unit) => {
  let armorPips = [];
  let structurePips = [];
  let columns = '';
  let columnCount = unit.armor < unit.structure ? unit.structure : unit.armor;


  for(let i = 0; i < columnCount; i++) {
    if (i < unit.armor) {
      armorPips.push(<a key={i}>{i+1}</a>);
    }
    if (i < unit.structure) {
      structurePips.push(<a key={i}>{i+1}</a>);
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

const getAbilities = (unit) => {
  let abilities = [];

  for (let name of unit.abilities) {
    let ability = getUnitAbility(name);
    if (ability) {
      abilities.push(
        <Fragment key={ability.rawTag}>
          <button className="link" type="button" popoverTarget={unit.id + ability.rawTag + "-popover"} popoverTargetAction="toggle">{ability.rawTag}</button>
          <div popover="auto" id={unit.id + ability.rawTag+"-popover"}>
            <h4>{ability.name}</h4>
            <div className="type">{ability.tag}<span>page {ability.asce_page}</span></div>
            {ability.summary.map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </Fragment>);
    }
  }
  return abilities;
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

export function Unit( {unit, onClick, actions = null} ) {
  const popover = useRef();
  const popoverAnchor = useRef();

  const handleClick = (e) => {
    if (onClick) {
      e.target.blur();
      onClick(e);
    } 
    popover.current?.showPopover({source: popoverAnchor.current});
  }

  return <div key={unit.id} className='unit' ref={popoverAnchor} popoverTarget={unit.id + "-actions"} onClick={(e) => handleClick(e)}>
    <div className="data">
      <div className="">
        <span className="class">{unit.class}</span> <span className="variant">{unit.variant}</span>
      </div>
      <div className="row">
        <StatPair label="Type" values={unit.type} />
        <StatPair label="MV" values={getMoves(unit)} />
        <StatPair label="TMM" values={getTMM(unit)} />
        <StatPair label="Size" values={unit.size} />
      </div>
      <div className="combat row">
        {getHealth(unit)}
        {getDamage(unit)}
        
        <StatPair label="OV" values={unit.overheat} />
      </div>
      <div className="abilities">
        {getAbilities(unit)}
      </div>
    </div>
    <img src={unit.imageURL} />
    <div className="pv">{unit.pv}</div>
    {actions?.length > 0 ? 
      <div className="actions" id={unit.id + "-actions"} popover="auto" ref={popover}>
        {actions.map((action, index) => {
          // Create the actions
          return <button key={index} type="button" onClick={() => action.cb(unit)}>{action.name}</button>
        })}
      </div> : null }
  </div>;
}

export function UnitWide( {unit, onClick, disabled, actions = null, className} ) {
  const popover = useRef();
  const popoverAnchor = useRef();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } 
    popover.current?.showPopover({source: popoverAnchor.current});
  }

  const classes = className ? className?.split(' ') : [];
  classes.push('unit', 'wide');
  if (disabled) {
    classes.push('disabled');
    onClick = false;
  }
  if (onClick) {
    classes.push('clickable');
  }

  return <div key={unit.id} ref={popoverAnchor} popoverTarget={unit.mulID + "-actions"} title={disabled ? disabled : null} className={classes.join(' ')} onClick={(e) => handleClick(e, unit)}>
    <div className="data">
      <div className="">
        <span className="class">{unit.class}</span> <span className="variant">{unit.variant}</span>
      </div>
      <div className="row">
        <StatPair label="Type" values={unit.type} />
        <StatPair label="MV" values={getMoves(unit)} />
        <StatPair label="TMM" values={getTMM(unit)} />
        <StatPair label="Size" values={unit.size} />
        <StatPair label="Role" values={unit.role.name} />
        <StatPair label="Tech" values={unit.tech.name} />
      </div>
      <div className="combat row">
        {getHealth(unit)}
        {getDamage(unit)}
        
        <StatPair label="OV" values={unit.overheat} />
        <button className="era-icon link" type="button" popoverTargetAction="toggle" popoverTarget={unit.mulID + unit.era.name} title={unit.era.name} style={{backgroundImage: 'url(' + unit.era.iconURL + ')'}}>{unit.era.name}</button>
        <div popover="auto" id={unit.mulID + unit.era.name}>{unit.era.name}</div>
      </div>
      <div className="abilities">
        {getAbilities(unit)}
      </div>
    </div>
    <img src={unit.imageURL} />
    <div className="pv">{unit.pv}</div>    {actions?.length > 0 ? 
      <div className="actions" id={unit.mulID + "-actions"} popover="auto" ref={popover}>
        {actions.map((action, index) => {
          // Create the actions
          return <button key={index} type="button" onClick={() => action.cb(unit)}>{action.name}</button>
        })}
      </div> : null }
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

export function AddUnitForm( {campaignId, initialCampaign} ) {
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
  const [campaign, setCampaign] = useState(initialCampaign);
  const autofocus = useRef();

  let lastSearchId = null;

  const handleSubmit = (unit) => {
    if (unit) {
      addUnit(campaignId, unit);
      router.back();
    }
  }

  const handleSelection = (event, unit) => {
    if (event.target.tagName == "BUTTON") {
      console.log('aborting because it\'s a button');
      return;
    }
    if (selectedUnit !== unit) {
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

  useEffect(() => {
    return getCampaignSnapshotById((data) => {
      setCampaign(data);
    }, campaignId);
  },[]);

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
      <Panel title="Add Unit to Force">
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

      <h3 className="text-center">
        Search Results ({isSearching ? '...' : searchResults.length})
      </h3>

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
                let disabled = campaign.status == 'preparing' ? unit.pv > campaign.currentPV : unit.pv *40 > campaign.currentSP;
                return (
                  <UnitWide unit={unit} key={unitIndex} 
                    className={selectedUnit == asUnit ? 'active' : null } 
                    onClick={(e) => handleSelection(e, asUnit)}
                    disabled={disabled ? 'Not enough resources to add this unit' : false}
                    />
                )
              })}
            </div>
          ) : null }

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
