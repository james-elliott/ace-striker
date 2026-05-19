import { getMULEraLabel } from "@/src/lib/utils/mulUtilities";

export function convertUnit(MULunit) {
  // Create the unit object
  const newUnit = {
    name: MULunit.Name,
    class: MULunit.Class,
    variant: MULunit.Variant,
    pv: MULunit.BFPointValue,
    type: MULunit.BFType,
    movement: [],
    size: MULunit.BFSize,
    imageURL: MULunit.ImageUrl,
    armor: MULunit.BFArmor,
    structure: MULunit.BFStructure,
    damage: [
        { range: 'short', value: MULunit.BFDamageShort, minimal: MULunit.BFDamageShortMin ? true : false },
        { range: 'medium',value: MULunit.BFDamageMedium, minimal: MULunit.BFDamageMediumMin ? true : false },
        { range: 'long',value: MULunit.BFDamageLong, minimal: MULunit.BFDamageLongMin ? true : false },
        { range: 'extreme',value: MULunit.BFDamageExtreme, minimal: MULunit.BFDamageExtremeMin ? true : false },
    ],
    overheat: MULunit.BFOverheat,
    abilities: [],
    mulID: MULunit.Id,
    role: MULunit.Role.Name,
    era: {
      id: MULunit.EraId,
      start: MULunit.EraStart,
      iconURL: MULunit.EraIcon,
      name: getMULEraLabel(MULunit.EraId),
    },
    role: {
      id: MULunit.Role.Id,
      name: MULunit.Role.Name,
    },
    tech: {
      id: MULunit.Technology.Id,
      name: MULunit.Technology.Name,
    },
    rules: MULunit.Rules,
  }

  if (MULunit.BFAbilities) {
    let matches = MULunit.BFAbilities.match(/([^,(]+(\(.*?\))*)+/g);
    if (!matches) {
      newUnit.abilities = [];
    } else {
      for( let ability of matches ) {
        newUnit.abilities.push(ability.trim());
      }
    }
  }

  let moves = MULunit.BFMove.replaceAll('"','');
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

  return newUnit;
}

// Stored search results from MUL so we don't keep hammering the server
export const cachedResults = [
    {
        "Id": 5564,
        "Name": "Atlas AS7-00 (Jurn)",
        "GroupName": "",
        "Class": "Atlas",
        "Variant": "AS7-00 (Jurn)",
        "Tonnage": 100,
        "BattleValue": 2058,
        "Technology": {
            "Id": 1,
            "Name": "Inner Sphere",
            "Image": null,
            "SortOrder": 0
        },
        "Cost": 25128000,
        "Rules": "Experimental",
        "TROId": 361,
        "TRO": "XTR:Periphery",
        "RSId": 361,
        "RS": "XTR:Periphery",
        "EraIcon": "https://i.ibb.co/VtCdwyP/era06-republic-dark-age.png",
        "DateIntroduced": "3081",
        "EraId": 15,
        "EraStart": 3081,
        "ImageUrl": "https://i.ibb.co/xXS4Qbv/atlas-xtr.png",
        "IsFeatured": true,
        "IsPublished": true,
        "Release": 2,
        "Type": {
            "Id": 18,
            "Name": "BattleMech",
            "Image": "BattleMech.gif",
            "SortOrder": 0
        },
        "Role": {
            "Id": 111,
            "Name": "Sniper",
            "Image": null,
            "SortOrder": 7
        },
        "BFType": "BM",
        "BFSize": 4,
        "BFMove": "6\"",
        "BFTMM": 0,
        "BFArmor": 10,
        "BFStructure": 4,
        "BFThreshold": 0,
        "BFDamageShort": 4,
        "BFDamageShortMin": false,
        "BFDamageMedium": 4,
        "BFDamageMediumMin": false,
        "BFDamageLong": 4,
        "BFDamageLongMin": false,
        "BFDamageExtreme": 0,
        "BFDamageExtemeMin": false,
        "BFOverheat": 0,
        "BFPointValue": 51,
        "BFAbilities": "ARM,CASEII,IF1,MHQ1,PRB,RCN,RSD2",
        "Skill": 0,
        "FormatedTonnage": "100"
    },
    {
        "Id": 7433,
        "Name": "Atlas AS7-A",
        "GroupName": "",
        "Class": "Atlas",
        "Variant": "AS7-A",
        "Tonnage": 100,
        "BattleValue": 1787,
        "Technology": {
            "Id": 1,
            "Name": "Inner Sphere",
            "Image": null,
            "SortOrder": 0
        },
        "Cost": 9527000,
        "Rules": "Introductory",
        "TROId": 422,
        "TRO": "TR:SW",
        "RSId": 423,
        "RS": "RS:SW",
        "EraIcon": "https://i.ibb.co/MB09bVm/era02-succession-wars.png",
        "DateIntroduced": "2954",
        "EraId": 255,
        "EraStart": 2901,
        "ImageUrl": "https://i.ibb.co/VtHKQ7Q/atlas-rg.png",
        "IsFeatured": false,
        "IsPublished": true,
        "Release": 1,
        "Type": {
            "Id": 18,
            "Name": "BattleMech",
            "Image": "BattleMech.gif",
            "SortOrder": 0
        },
        "Role": {
            "Id": 108,
            "Name": "Juggernaut",
            "Image": null,
            "SortOrder": 3
        },
        "BFType": "BM",
        "BFSize": 4,
        "BFMove": "6\"",
        "BFTMM": 0,
        "BFArmor": 10,
        "BFStructure": 8,
        "BFThreshold": 0,
        "BFDamageShort": 4,
        "BFDamageShortMin": false,
        "BFDamageMedium": 5,
        "BFDamageMediumMin": false,
        "BFDamageLong": 2,
        "BFDamageLongMin": false,
        "BFDamageExtreme": 0,
        "BFDamageExtemeMin": false,
        "BFOverheat": 2,
        "BFPointValue": 52,
        "BFAbilities": "IF1,SRM3/3",
        "Skill": 0,
        "FormatedTonnage": "100"
    },
    {
        "Id": 138,
        "Name": "Atlas AS7-C",
        "GroupName": "",
        "Class": "Atlas",
        "Variant": "AS7-C",
        "Tonnage": 100,
        "BattleValue": 2163,
        "Technology": {
            "Id": 1,
            "Name": "Inner Sphere",
            "Image": null,
            "SortOrder": 0
        },
        "Cost": 22960000,
        "Rules": "Standard",
        "TROId": 231,
        "TRO": "TR:3050U",
        "RSId": 200,
        "RS": "RS:3050Uu-I",
        "EraIcon": "https://i.ibb.co/k6ySqKN/era03-clan-invasion.png",
        "DateIntroduced": "3050",
        "EraId": 13,
        "EraStart": 3050,
        "ImageUrl": "https://i.ibb.co/VtHKQ7Q/atlas-rg.png",
        "IsFeatured": false,
        "IsPublished": true,
        "Release": 1,
        "Type": {
            "Id": 18,
            "Name": "BattleMech",
            "Image": "BattleMech.gif",
            "SortOrder": 0
        },
        "Role": {
            "Id": 111,
            "Name": "Sniper",
            "Image": null,
            "SortOrder": 7
        },
        "BFType": "BM",
        "BFSize": 4,
        "BFMove": "6\"",
        "BFTMM": 0,
        "BFArmor": 10,
        "BFStructure": 4,
        "BFThreshold": 0,
        "BFDamageShort": 3,
        "BFDamageShortMin": false,
        "BFDamageMedium": 4,
        "BFDamageMediumMin": false,
        "BFDamageLong": 4,
        "BFDamageLongMin": false,
        "BFDamageExtreme": 0,
        "BFDamageExtemeMin": false,
        "BFOverheat": 1,
        "BFPointValue": 51,
        "BFAbilities": "AMS,C3S,CASE,IF1,MHQ1,OVL,REAR1/1/-",
        "Skill": 0,
        "FormatedTonnage": "100"
    },
    {
        "Id": 139,
        "Name": "Atlas AS7-CM",
        "GroupName": "",
        "Class": "Atlas",
        "Variant": "AS7-CM",
        "Tonnage": 100,
        "BattleValue": 2036,
        "Technology": {
            "Id": 1,
            "Name": "Inner Sphere",
            "Image": null,
            "SortOrder": 0
        },
        "Cost": 25176000,
        "Rules": "Standard",
        "TROId": 231,
        "TRO": "TR:3050U",
        "RSId": 200,
        "RS": "RS:3050Uu-I",
        "EraIcon": "https://i.ibb.co/k6ySqKN/era03-clan-invasion.png",
        "DateIntroduced": "3050",
        "EraId": 13,
        "EraStart": 3050,
        "ImageUrl": "https://i.ibb.co/VtHKQ7Q/atlas-rg.png",
        "IsFeatured": false,
        "IsPublished": true,
        "Release": 1,
        "Type": {
            "Id": 18,
            "Name": "BattleMech",
            "Image": "BattleMech.gif",
            "SortOrder": 0
        },
        "Role": {
            "Id": 111,
            "Name": "Sniper",
            "Image": null,
            "SortOrder": 7
        },
        "BFType": "BM",
        "BFSize": 4,
        "BFMove": "6\"",
        "BFTMM": 0,
        "BFArmor": 10,
        "BFStructure": 4,
        "BFThreshold": 0,
        "BFDamageShort": 3,
        "BFDamageShortMin": false,
        "BFDamageMedium": 4,
        "BFDamageMediumMin": false,
        "BFDamageLong": 4,
        "BFDamageLongMin": false,
        "BFDamageExtreme": 0,
        "BFDamageExtemeMin": false,
        "BFOverheat": 0,
        "BFPointValue": 54,
        "BFAbilities": "AMS,C3M,CASE,IF1,LRM1/1/1,MHQ5,REAR1/1/-,TAG",
        "Skill": 0,
        "FormatedTonnage": "100"
    },
    {
        "Id": 140,
        "Name": "Atlas AS7-D",
        "GroupName": "",
        "Class": "Atlas",
        "Variant": "AS7-D",
        "Tonnage": 100,
        "BattleValue": 1897,
        "Technology": {
            "Id": 1,
            "Name": "Inner Sphere",
            "Image": null,
            "SortOrder": 0
        },
        "Cost": 9626000,
        "Rules": "Introductory",
        "TROId": 422,
        "TRO": "TR:SW",
        "RSId": 511,
        "RS": "RSFP:Wave 2",
        "EraIcon": "https://i.ibb.co/fr2Wdf0/era01-age-of-war-star-league.png",
        "DateIntroduced": "2755",
        "EraId": 10,
        "EraStart": 2571,
        "ImageUrl": "https://i.ibb.co/VtHKQ7Q/atlas-rg.png",
        "IsFeatured": true,
        "IsPublished": true,
        "Release": 1,
        "Type": {
            "Id": 18,
            "Name": "BattleMech",
            "Image": "BattleMech.gif",
            "SortOrder": 0
        },
        "Role": {
            "Id": 108,
            "Name": "Juggernaut",
            "Image": null,
            "SortOrder": 3
        },
        "BFType": "BM",
        "BFSize": 4,
        "BFMove": "6\"",
        "BFTMM": 0,
        "BFArmor": 10,
        "BFStructure": 8,
        "BFThreshold": 0,
        "BFDamageShort": 5,
        "BFDamageShortMin": false,
        "BFDamageMedium": 5,
        "BFDamageMediumMin": false,
        "BFDamageLong": 2,
        "BFDamageLongMin": false,
        "BFDamageExtreme": 0,
        "BFDamageExtemeMin": false,
        "BFOverheat": 0,
        "BFPointValue": 52,
        "BFAbilities": "AC2/2/-,IF1,LRM1/1/1,REAR1/1/-",
        "Skill": 0,
        "FormatedTonnage": "100"
    }
]