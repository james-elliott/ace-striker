import "./pills.css";
import { useState, useRef, useEffect } from "react";

export function PillInput( { id, onUpdate, selected, options, optionsCB, showAll = false } ) {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState(showAll ? options : []);
  const pillSearch = useRef();

  const updateSearch = ( event ) => {
    setSearch(event.currentTarget.value);
    
    let searchValue = event.currentTarget.value;
    if( searchValue.length < 1 ) {
      setSuggestions(showAll ? options : []);
      return;
    }

    let arrFound = [];
    for( let suggestionID of options ) {
      let label = optionsCB ? optionsCB(suggestionID) : suggestionID;
      if( label.toLowerCase().includes( searchValue.toLowerCase() ) ) {
        arrFound.push( suggestionID  );
      }
    }
    setSuggestions(arrFound);
  }

  const addSelected = ( optionID ) => {
    pillSearch.current.focus();
    if( selected.includes( optionID ) ) {
      return;
    }
    
    let newSelections = [];
    for (let faction of selected) {
      newSelections.push(faction);
    }
    newSelections.push( optionID );
    onUpdate(newSelections);
  }

  const removeSelected = ( optionID ) => {
    pillSearch.current.focus();
    let newSelections = selected.filter( (faction) => faction !== optionID );
    onUpdate(newSelections);
  }
  
  return (
    <div className="pill-wrapper">
      <div className="pill-input">
        {selected.length > 0 ? (
          <>
            {selected.map( (optionID, index) => { 
              return <span key={index}>{optionsCB ? optionsCB(optionID) : optionID}<a href="#" className="material-symbols-outlined" onClick={() => removeSelected(optionID)}>close_small</a></span>
            })}
          </>
        ) : null }
        <input
            type="search"
            onChange={updateSearch}
            onFocus={updateSearch}
            value={search}
            id={id}
            ref={pillSearch}
          />
      </div>
      <div className="pill-dropdown">
        {suggestions.length > 0 ? (
          <>
            {suggestions.map( (suggestionID, index) => {
              const active = selected.includes(suggestionID);
              const click = active ? removeSelected : addSelected;

              return <a href="#" key={index} className={active ? 'active' : null } onClick={() => click(suggestionID)}>{optionsCB ? optionsCB(suggestionID) : suggestionID}</a>;
            })}
          </>
        ) : <span>Type to search options</span> }
      </div>
    </div>
  );
}