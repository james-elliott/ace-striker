"use client";

import { addSortie } from "./actions";
import { useRouter } from "next/navigation";
import Panel from "../ui/panel/panel";
import { useForm } from "react-hook-form";
import "./sorties.css";
import { db } from "@/src/lib/firebase/clientApp";
import { query, collection, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";


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

    // let data = sortResults(sort, asc, sorties);

    setSortBy(sort);
    setSortAsc(asc);
    // setSorties(data);
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
        <td>{sortie.name}</td>
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

// Add pilot form
export function AddSortieForm( props ) {
  const { register } = useForm();
  const router = useRouter();
  const addSortieToCampaign = addSortie.bind(null, props.campaignId);

  const handleClose = (e) => {
    router.back();
  };

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