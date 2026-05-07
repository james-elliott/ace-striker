"use server";

import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore, collection, addDoc, query, getDocs } from "firebase/firestore";
import { redirect } from "next/navigation";

// Save unit to campaign force
export async function addUnit(campaignId, unitData) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const db = getFirestore(firebaseServerApp);

  // First we check the existing force to make sure we don't have too many duplicates of the same class or variant.
  const force = await getUnits(db, campaignId);
  let classFilter = force.filter((unit) => unit.class == unitData.Class);
  let variantFilter = classFilter.filter((unit) => unit.variant == unitData.Variant);
  if (classFilter.length > 1) {
    console.log('Only two units of the same class allowed');
    return;
  } else if (variantFilter.length > 0) {
    console.log('Only one of the same variant allowed');
    return;
  }

  // Create the unit object
  const newUnit = {
    name: unitData.Name,
    class: unitData.Class,
    variant: unitData.Variant,
    pv: unitData.BFPointValue,
    type: unitData.BFType,
    movement: [],
    size: unitData.BFSize,
    imageURL: unitData.ImageUrl,
    armor: unitData.BFArmor,
    structure: unitData.BFStructure,
    damage: [
        { range: 'short', value: unitData.BFDamageShort, minimal: unitData.BFDamageShortMin ? true : false },
        { range: 'medium',value: unitData.BFDamageMedium, minimal: unitData.BFDamageMediumMin ? true : false },
        { range: 'long',value: unitData.BFDamageLong, minimal: unitData.BFDamageLongMin ? true : false },
        { range: 'extreme',value: unitData.BFDamageExtreme, minimal: unitData.BFDamageExtremeMin ? true : false },
    ],
    overheat: unitData.BFOverheat,
    abilities: [],
    mulID: unitData.Id,
    role: unitData.Role.Name,
  }

  if (unitData.BFAbilities) {
    let matches = unitData.BFAbilities.match(/([^,(]+(\(.*?\))*)+/g);
    if (!matches) {
      newUnit.abilities = [];
    } else {
      for( let ability of matches ) {
        newUnit.abilities.push(ability.trim());
      }
    }
  }

  let moves = unitData.BFMove.replaceAll('"','');
  moves = moves.split('/');

  for (let move of moves) {
    let dist = parseInt(move.replace(/\D/g,''));
    let type = move.replace(/\d/g,'');
    type = type ? type : 'g';
    newUnit.movement.push({ move: dist, type: type})
  }
  if (newUnit.movement.length == 1 && newUnit.movement[0].type == 'j') {
    newUnit.movement.unshift({ move: newUnit.movement[0].move, type: 'g'});
  }
  
  
  if (!['AF','DA','DS','SC'].includes(newUnit.type)) {
    // This is NOT an air unit
    newUnit.isGround = true;
  }
  
//   console.log("unitData", unitData);
//   console.log("newUnit", newUnit);
//   console.log('moves & movement', moves, movement);

  // Write to the campaign's unit collection
  try {
    const docRef = collection(db, 'campaigns', campaignId, 'units');
    await addDoc(docRef, newUnit);
  } catch (e) {
    console.log("There was an error adding this unit");
    console.error("Error adding document: ", e);
  }
//   redirect(`/campaign/` + campaignId + `/roster`);
}

export async function getUnits(db = db, campaignId) {
  if (campaignId == null) {
    console.log('Error: No campaign id');
    return;
  }
  let q = query(collection(db, "campaigns", campaignId, "units"));

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      //timestamp: doc.data().timestamp.toDate(),
    };
  });
}