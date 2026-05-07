import { replaceAll } from "./replaceAll";

export function getMULFactionLabels(id: number): string {
    if(id === 1){ return 'Clan Burrock'; }
        if(id === 2){ return 'Clan Blood Spirit'; }
        if(id === 3){ return 'Extinct'; }
        if(id === 4){ return 'Unique'; }
        if(id === 5){ return 'Capellan Confederation'; }
        if(id === 6){ return 'Clan Cloud Cobra'; }
        if(id === 7){ return 'Clan Coyote'; }
        if(id === 8){ return 'Clan Diamond Shark'; }
        if(id === 9){ return 'Circinus Federation'; }
        if(id === 10){ return 'Clan Fire Mandrill'; }
        if(id === 11){ return 'Clan Ghost Bear'; }
        if(id === 12){ return 'Clan Goliath Scorpion'; }
        if(id === 13){ return 'Clan Hell\'s Horses'; }
        if(id === 14){ return 'Clan Ice Hellion'; }
        if(id === 15){ return 'Clan Jade Falcon'; }
        if(id === 16){ return 'Clan Mongoose'; }
        if(id === 17){ return 'Clan Nova Cat'; }
        if(id === 18){ return 'ComStar'; }
        if(id === 19){ return 'Clan Star Adder'; }
        if(id === 20){ return 'Clan Smoke Jaguar'; }
        if(id === 21){ return 'Clan Snow Raven'; }
        if(id === 22){ return 'Clan Steel Viper'; }
        if(id === 23){ return 'Clan Wolf (in Exile)'; }
        if(id === 24){ return 'Clan Wolf'; }
        if(id === 25){ return 'Clan Widowmaker'; }
        if(id === 26){ return 'Clan Wolverine'; }
        if(id === 27){ return 'Draconis Combine'; }
        if(id === 28){ return 'Free Rasalhague Republic'; }
        if(id === 29){ return 'Federated Suns'; }
        if(id === 30){ return 'Free Worlds League'; }
        if(id === 31){ return 'Kell Hounds'; }
        if(id === 32){ return 'Lyran Alliance'; }
        if(id === 33){ return 'Magistracy of Canopus'; }
        if(id === 34){ return 'Mercenary'; }
        if(id === 35){ return 'Marian Hegemony'; }
        if(id === 36){ return 'Outworlds Alliance'; }
        if(id === 38){ return 'Pirates'; }
        if(id === 39){ return 'Raven Alliance'; }
        if(id === 40){ return 'Rasalhague Dominion'; }
        if(id === 41){ return 'Republic of the Sphere'; }
        if(id === 42){ return 'Rim Worlds Republic - Home Guard'; }
        if(id === 43){ return 'Star League Royal'; }
        if(id === 44){ return 'Solaris 7'; }
        if(id === 45){ return 'Star League Regular'; }
        if(id === 46){ return 'Star League (Second)'; }
        if(id === 47){ return 'Taurian Concordat'; }
        if(id === 48){ return 'Word of Blake'; }
        if(id === 49){ return 'Wolf\'s Dragoons'; }
        if(id === 54){ return 'Not Available'; }
        if(id === 55){ return 'Inner Sphere General'; }
        if(id === 56){ return 'IS Clan General'; }
        if(id === 57){ return 'Periphery General'; }
        if(id === 59){ return 'Free Worlds League (Duchy of Andurien)'; }
        if(id === 60){ return 'Lyran Commonwealth'; }
        if(id === 67){ return 'Free Worlds League (Oriente Protectorate)'; }
        if(id === 72){ return 'Free Worlds League (Regulan Fiefs)'; }
        if(id === 74){ return 'Free Worlds League (Marik-Stewart Commonwealth)'; }
        if(id === 75){ return 'Free Worlds League (Duchy of Tamarind-Abbey)'; }
        if(id === 76){ return 'Free Worlds League (Rim Commonality)'; }
        if(id === 77){ return 'Filtvelt Coalition'; }
        if(id === 78){ return 'Calderon Protectorate'; }
        //if(id === 79){ return 'Blank General List'; } We don't need this one
        if(id === 80){ return 'Clan Stone Lion'; }
        if(id === 82){ return 'Clan Sea Fox'; }
        if(id === 83){ return 'St. Ives Compact'; }
        if(id === 84){ return 'Federated Commonwealth'; }
        if(id === 85){ return 'HW Clan General'; }
        if(id === 86){ return 'Society'; }
        if(id === 87){ return 'Terran Hegemony'; }
        if(id === 88){ return 'Rim Worlds Republic - Terran Corps'; }
        if(id === 89){ return 'Free Worlds League (Non-Aligned Worlds)'; }
        if(id === 90){ return 'Star League General'; }
        if(id === 91){ return 'Scorpion Empire'; }
        if(id === 92){ return 'Escorpión Imperio'; }
        if(id === 94){ return 'Star League in Exile'; }
        if(id === 95){ return 'Fronc Reaches'; }
        if(id === 96){ return 'Star League (Clan Wolf)'; }
        if(id === 97){ return 'Star League (Clan Jade Falcon)'; }
        if(id === 98){ return 'Star League (Clan Smoke Jaguar)'; }
        if(id === 100){ return 'Clan Protectorate'; }
        if(id === 101){ return 'Wolf Empire'; }
        if(id === 102){ return 'Alyina Mercantile League'; }
        if(id === 104){ return 'Tamar Pact'; }
        if(id === 105){ return 'Vesper Marches'; }
        if(id === 106){ return 'BA: Other Squad Size in Use'; }
        if(id === 107){ return 'Barber\'s Marauder IIs'; }
        if(id === 108){ return 'No Significant Distribution'; }
        if(id === 109){ return 'Insufficient Data'; }
        if(id === 110){ return 'Spirit Cats'; }
        if(id === 111){ return 'Star League (SLDF)'; }
      
        return "";
}

export function getMULFactionIDs(): number[] {
    return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,38,39,40,41,42,43,44,45,46,47,48,49,54,55,56,57,59,60,67,72,74,75,76,77,78,80,82,83,84,85,86,87,88,89,90,91,92,94,95,96,97,98,100,101,102,104,105,106,107,108,109,110,111];
}

export function getMULEraLabel(
    id: number,
): string {

    if( id === 10 ) {
        return "Star League";
    } else if( id === 11 ) {
        return "Early Succession War";
    } else  if( id === 255 ) {
        return "Late Succession War - LosTech";
    } else if( id === 256 ) {
        return "Late Succession War - renaissance";
    } else if( id === 13 ) {
        return "Clan Invasion";
    } else if( id === 247 ) {
        return "Civil War";
    } else if( id === 14 ) {
        return "Jihad";
    } else if( id === 15 ) {
        return "Early Republic";
    } else if( id === 254 ) {
        return "Late Republic";
    } else if( id === 16 ) {
        return "Dark Ages";
    } else if( id === 257 ) {
        return "ilClan";
    }
    return "n/a";
}

export function getMULEraIDs(): number[] {
    return [10, 11, 255, 256, 13, 247, 14, 15, 254, 16, 257]
}

export function getMULTypeLabel(
    id: number,
): string {

    if( id === 18 ) {
        return "BattleMech";
    }
    if( id === 19 ) {
        return "Combat Vehicle";
    }
    if( id === 17 ) {
        return "Aerospace";
    }
    if( id === 21 ) {
        return "Infantry";
    }
    if( id === 20 ) {
        return "IndustrialMech";
    }
    if( id === 23 ) {
        return "Protomech";
    }
    if( id === 24 ) {
        return "Support Vehicle ";
    }

    return "n/a";
}

export function getMULTypeIDs(): number[] {
    return [18, 19, 17, 21, 20, 23, 24 ];
}


export function getMULGroundRoles(): string[] {
    return [
        "Ambusher",
        "Brawler",
        "Juggernaut",
        "Missile Boat",
        "Scout",
        "Skirmisher",
        "Sniper",
        "Striker",
     ];
}

export function getMULAerospaceRoles(): string[] {
    return [
        "Attack",
        "Dogfighter",
        "Fast Dogfighter",
        "Fire Support",
        "Interceptor",
        "Transport",
     ];
}


export interface ASMULType {
    Id: number;
    Image: string | null;
    Name: string;
    SortOrder: number;
}
export interface ASMULRole {
    Id: number;
    Image: string | null;
    Name: string;
    SortOrder: number;
}
export interface ASMULTech {
    Id: number;
    Image: string | null;
    Name: string;
    SortOrder: number;
}

export interface IASMULUnit {
    // mechCreatorUUID: string;
    FormatedTonnage: string | null; // typo in MUL
    GroupName: string | null;
    BFAbilities: string | null;
    BFArmor: number;
    BFDamageExtreme: number;
    BFDamageLong: number;
    BFDamageMedium: number;
    BFDamageShort: number;
    BFMove: string;
    BFOverheat: number;
    BFPointValue: number;
    BFSize: number;
    BFStructure: number;
    BFTMM: number;
    BFThreshold: number;
    BFType: string | null;
    BattleValue: number;
    Class: string;

    Cost: number;
    DateIntroduced: string;
    EraIcon:string;
    EraId: number;
    EraStart: number;
    Id: number;
    ImageUrl: string;
    IsFeatured: boolean;
    IsPublished: boolean;
    Name: string;
    RS: string;
    RSId: number;
    Release: number;
    Role: ASMULRole;
    Rules: string;
    Skill: number;
    TRO: string;
    TROId: number;
    Technology: ASMULTech;
    Tonnage: number;
    Type: ASMULType;
    Variant: string | null;

    BFDamageShortMin?: boolean;
    BFDamageMediumMin?: boolean;
    BFDamageLongMin?: boolean;
    BFDamageExtremeMin?: boolean;
}

export async function getMULASSearchResults(
    searchTerm: string,
    mechRules: string,
    techFilter: string,
    roleFilter: string,
    eraFilter: number,
    typeFilter: number[],
    factionFilter: number[],
    offLine: boolean,
    overrideSearchLimitLength: boolean = false,
): Promise<IASMULUnit[]> {

    let returnUnits: IASMULUnit[] = [];

    let rulesNumbersURI: string[] = [];

    // console.log("mechRules", mechRules, searchTerm)

    if( mechRules.toLowerCase() === "introductory" ) {
        rulesNumbersURI.push( "&Rules=55" );
    }
    if( mechRules.toLowerCase() === "standard" ) {
        rulesNumbersURI.push( "&Rules=4" );
    }
    if( mechRules.toLowerCase() === "advanced" ) {
        rulesNumbersURI.push( "&Rules=5" );
    }
    if( mechRules.toLowerCase() === "intro+standard" ) {
        rulesNumbersURI.push( "&Rules=55" );
        rulesNumbersURI.push( "&Rules=4" );
    }
    if( mechRules.toLowerCase() === "intro+standard+advanced" ) {
        rulesNumbersURI.push( "&Rules=55" );
        rulesNumbersURI.push( "&Rules=4" );
        rulesNumbersURI.push( "&Rules=5" );
    }
    if( mechRules.toLowerCase() === "intro+standard+advanced+experimental" ) {
        rulesNumbersURI.push( "&Rules=55" );
        rulesNumbersURI.push( "&Rules=4" );
        rulesNumbersURI.push( "&Rules=5" );
        rulesNumbersURI.push( "&Rules=6" );
    }
    if( mechRules.toLowerCase() === "experimental" ) {
        rulesNumbersURI.push( "&Rules=6" );
    }
    if( mechRules.toLowerCase() === "era specific" ) {
        rulesNumbersURI.push( "&Rules=56" );
    }
    if( mechRules.toLowerCase() === "unknown" ) {//unknown
        rulesNumbersURI.push( "&Rules=78" );
    }

    let roleFilterURI: string[] = [];
    if( roleFilter.trim() ) {
        roleFilterURI.push( "&Roles=" + replaceAll(roleFilter, " ", "%20", false, false, true) );
    }

    let techFilterURI: string[] = [];
    // we can get passed 'is+clan' here from home.tsx if we're searching for mechs
    // in a mixed-tech lance (e.g. GDL, WD, KH) - we just skip any filtering
    // at this point.
    if( techFilter.toLowerCase() === "inner sphere" ) {
        techFilterURI.push( "&Technologies=1" );
    }
    if( techFilter.toLowerCase() === "clan" ) {
        techFilterURI.push( "&Technologies=2" );
    }
    if( techFilter.toLowerCase() === "mixed" ) {
        techFilterURI.push( "&Technologies=3" );
    }
    if( techFilter.toLowerCase() === "primitive" ) {
        techFilterURI.push( "&Technologies=57" );
    }

    let typesFilterURI: string[] = [];

    if( typeFilter.length > 0 ) {
        typeFilter.map((type) => {
            typesFilterURI.push( "&Types=" + type );
        });
    }

    let factionFilterURI: string[] = [];
    if( factionFilter.length > 0 ) {
        for( let faction of factionFilter ) {
            factionFilterURI.push( "&Factions=" + faction );
        }
    }
    console.log('Searching...');
    if( offLine === false ) {
        // let url = "https://btmul.net/Unit/QuickList?MinPV=1&MaxPV=999";
        // let url = "http://localhost:5001/Unit/QuickList?MinPV=1&MaxPV=999";
        let url = "https://masterunitlist.azurewebsites.net/Unit/QuickList?"
        let minpv = 1;
        let maxpv = 999;

        // if( eraFilter && eraFilter > 0 ) {
        //     url += "&Eras=" + eraFilter.toString();
        // }
        if( eraFilter && eraFilter > 0 ) {
            url += "&AvailableEras=" + eraFilter.toString();
        }

        url += rulesNumbersURI.join("");
        url += typesFilterURI.join('');
        url += techFilterURI.join();
        url += roleFilterURI.join();
        url += factionFilterURI.join("");

        console.log(url);

        var abilitySearch: string[] = [];
        var abilityExclude: string[] = [];
        var nameSearch: string[] = [];
        var minDamage = [-1, -1, -1];
        var maxDamage = [999, 999, 999];
        var minArmorStructure = [-1, -1];
        var maxArmorStructure = [999, 999];
        var introDate = [-1,10000];
        var minMove = -1;
        var maxMove = 999;
        var minJump = -1;
        var minDefense = -1;
        var exactDamageProfile: { short: number; medium: number; long: number } | null = null
    


        var searchTerms = searchTerm.trim().split(" ");

        for (var i = 0; i < searchTerms.length; i++) {
            let term = searchTerms[i];
            let value;
            let match;
            
            // Range syntax: field:min-max
            if (match = term.match(/^(\w+):(\d+)-(\d+)$/)) {
                const [, field, minStr, maxStr] = match;
                const min = parseInt(minStr);
                const max = parseInt(maxStr);
                
                switch(field) {
                    case 'pv':
                    case 'points':
                        minpv = min;
                        maxpv = max;
                        break;
                    case 'year':
                    case 'intro':
                        introDate[0] = min;
                        introDate[1] = max;
                        break;
                    case 'armor':
                    case 'ar':
                        minArmorStructure[0] = min;
                        maxArmorStructure[0] = max;
                        break;
                    case 'structure':
                    case 'st':
                        minArmorStructure[1] = min;
                        maxArmorStructure[1] = max;
                        break;
                    case 'mv':
                    case 'move':
                        minMove = min;
                        maxMove = max;
                        break;
                }
                continue;
            }
            
            // Enhanced comparison operators: field>=value, field<=value, field!=value
            if (match = term.match(/^(\w+)(>=|<=|!=|>|<|=)(.+)$/)) {
                const [, field, op, valueStr] = match;
                const val = parseInt(valueStr);
                
                switch(field) {
                    case 'pv':
                    case 'points':
                        switch(op) {
                            case '>': minpv = val + 1; break;
                            case '>=': minpv = val; break;
                            case '<': maxpv = val - 1; break;
                            case '<=': maxpv = val; break;
                            case '=': minpv = val; maxpv = val; break;
                            case '!=': 
                                // Handle != by setting ranges around the value
                                if (val > minpv && val < maxpv) {
                                    // This is tricky with MUL API, we'll filter locally
                                }
                                break;
                        }
                        break;
                    case 'short':
                    case 's':
                        switch(op) {
                            case '>': minDamage[0] = val + 1; break;
                            case '>=': minDamage[0] = val; break;
                            case '<': maxDamage[0] = val - 1; break;
                            case '<=': maxDamage[0] = val; break;
                            case '=': minDamage[0] = val; maxDamage[0] = val; break;
                        }
                        break;
                    case 'medium':
                    case 'm':
                        switch(op) {
                            case '>': minDamage[1] = val + 1; break;
                            case '>=': minDamage[1] = val; break;
                            case '<': maxDamage[1] = val - 1; break;
                            case '<=': maxDamage[1] = val; break;
                            case '=': minDamage[1] = val; maxDamage[1] = val; break;
                        }
                        break;
                    case 'long':
                    case 'l':
                        switch(op) {
                            case '>': minDamage[2] = val + 1; break;
                            case '>=': minDamage[2] = val; break;
                            case '<': maxDamage[2] = val - 1; break;
                            case '<=': maxDamage[2] = val; break;
                            case '=': minDamage[2] = val; maxDamage[2] = val; break;
                        }
                        break;
                    case 'armor':
                    case 'ar':
                        switch(op) {
                            case '>': minArmorStructure[0] = val + 1; break;
                            case '>=': minArmorStructure[0] = val; break;
                            case '<': maxArmorStructure[0] = val - 1; break;
                            case '<=': maxArmorStructure[0] = val; break;
                            case '=': minArmorStructure[0] = val; maxArmorStructure[0] = val; break;
                        }
                        break;
                    case 'structure':
                    case 'st':
                        switch(op) {
                            case '>': minArmorStructure[1] = val + 1; break;
                            case '>=': minArmorStructure[1] = val; break;
                            case '<': maxArmorStructure[1] = val - 1; break;
                            case '<=': maxArmorStructure[1] = val; break;
                            case '=': minArmorStructure[1] = val; maxArmorStructure[1] = val; break;
                        }
                        break;
                    case 'year':
                    case 'intro':
                        switch(op) {
                            case '>': introDate[0] = val + 1; break;
                            case '>=': introDate[0] = val; break;
                            case '<': introDate[1] = val - 1; break;
                            case '<=': introDate[1] = val; break;
                            case '=': introDate[0] = val; introDate[1] = val; break;
                        }
                        break;
                    case 'mv':
                    case 'move':
                        switch(op) {
                            case '>': minMove = val + 1; break;
                            case '>=': minMove = val; break;
                            case '<': maxMove = val - 1; break;
                            case '<=': maxMove = val; break;
                            case '=': minMove = val; maxMove = val; break;
                        }
                        break;
                    case 'jump':
                    case 'j':
                        switch(op) {
                            case '>': minJump = val + 1; break;
                            case '>=': minJump = val; break;
                            case '=': minJump = val; break;
                        }
                        break;
                    case 'defense':
                    case 'def':
                        switch(op) {
                            case '>': minDefense = val + 1; break;
                            case '>=': minDefense = val; break;
                        }
                        break;
                }
                continue;
            }
            
            // Enhanced ability syntax
            if (term.startsWith("a:")) {
                value = term.substring(2);
                if (value.includes(",")) {
                    // AND logic - must have all abilities
                    const abilities = value.split(",").filter(a => a.length > 1);
                    abilitySearch.push(...abilities);
                } else if (value.startsWith("!")) {
                    // NOT logic - must not have
                    const ability = value.substring(1);
                    if (ability.length > 1) {
                        abilityExclude.push(ability);
                    }
                } else if (value.length > 1) {
                    // Single ability
                    abilitySearch.push(value);
                }
                continue;
            }
            
            // Damage profile syntax: dmg:3/3/2 or dmg:3/*/*
            if (term.startsWith("dmg:") || term.startsWith("damage:")) {
                const dmgStr = term.substring(term.indexOf(":") + 1);
                const parts = dmgStr.split("/");
                if (parts.length === 3) {
                    exactDamageProfile = {
                        short: parts[0] === "*" ? -1 : parseInt(parts[0]),
                        medium: parts[1] === "*" ? -1 : parseInt(parts[1]),
                        long: parts[2] === "*" ? -1 : parseInt(parts[2])
                    };
                }
                continue;
            }
            
            // Legacy syntax support (backward compatibility)
            switch (true) {
                case term.startsWith("a:"):
                    value = term.substring(2);
                    if (value.length > 1) {
                        abilitySearch.push(value);
                    }
                    break;
        
                case term.startsWith("pv>"):
                    value = term.substring(3);
                    minpv = parseInt(value) + 1;
                    break;
        
                case term.startsWith("pv<"):
                    value = term.substring(3);
                    maxpv = parseInt(value) - 1;
                    break;
        
                case term.startsWith("pv="):
                    value = term.substring(3);
                    minpv = parseInt(value);
                    maxpv = parseInt(value);
                    break;
        
                case term.startsWith("short>"):
                    if (term.includes("=")) {
                        value = term.substring(7);
                        minDamage[0] = parseInt(value);
                    } else {
                        value = term.substring(6);
                        minDamage[0] = parseInt(value) + 1;
                    }
                    break;
        
                case term.startsWith("medium>"):
                    if (term.includes("=")) {
                        value = term.substring(8);
                        minDamage[1] = parseInt(value);
                    } else {
                        value = term.substring(7);
                        minDamage[1] = parseInt(value) + 1;
                    }
                    break;
        
                case term.startsWith("long>"):
                    if (term.includes("=")) {
                        value = term.substring(6);
                        minDamage[2] = parseInt(value);
                    } else {
                        value = term.substring(5);
                        minDamage[2] = parseInt(value) + 1;
                    }
                    break;

                case term.startsWith("armor>"):
                    if (term.includes("=")) {
                        value = term.substring(7);
                        minArmorStructure[0] = parseInt(value);
                    } else {
                        value = term.substring(6);
                        minArmorStructure[0] = parseInt(value) + 1;
                    }
                    break;

                case term.startsWith("structure>"):
                    if (term.includes("=")) {
                        value = term.substring(11);
                        minArmorStructure[1] = parseInt(value);
                    } else {
                        value = term.substring(10);
                        minArmorStructure[1] = parseInt(value) + 1;
                    }
                    break;
            
                case term.startsWith("intro>"):
                    if (term.includes("=")) {
                        value = term.substring(7);
                        introDate[0] = parseInt(value);
                    } else {
                        value = term.substring(6);
                        introDate[0] = parseInt(value) + 1;
                    }
                    break;

                case term.startsWith("intro<"):
                    if (term.includes("=")) {
                        value = term.substring(7);
                        introDate[1] = parseInt(value);
                    } else {
                        value = term.substring(6);
                        introDate[1] = parseInt(value) - 1;
                    }
                    break;

        
                default:
                    nameSearch.push(term);
                    break;
            }
        }
        if( abilitySearch.length > 0 ) {
            url += "&HasBFAbility=" + abilitySearch.join("+");
        }

        url += "&MinPV=" + minpv.toString();
        url += "&MaxPV=" + maxpv.toString();

        if( nameSearch.length > 0) {
            if(nameSearch.join("%20").length > 2){
                url += "&Name=" + nameSearch.join("%20");
            }
        }



        if(
            nameSearch.join("%20").length > 2
            || overrideSearchLimitLength
            || abilitySearch.length > 0
            || abilityExclude.length > 0
            || maxpv - minpv <= 40
            || minMove > -1
            || minJump > -1
            || minDefense > -1
            || exactDamageProfile !== null
        ) {
            await fetch(url)
            .then(async res => {
                let returnData = await res.json();

                if(!returnData) {
                    return [];
                }

                returnUnits = returnData.Units;
               
                if( !returnUnits ) {
                    return [];
                }
                for (i = 0; i < returnUnits.length; i++) {
                    let unit = returnUnits[i];
                    let shouldRemove = false;
                    
                    // Damage range filters
                    if( unit.BFDamageShort < minDamage[0] || unit.BFDamageShort > maxDamage[0] ) {
                        shouldRemove = true;
                    } else if( unit.BFDamageMedium < minDamage[1] || unit.BFDamageMedium > maxDamage[1] ) {
                        shouldRemove = true;
                    } else if( unit.BFDamageLong < minDamage[2] || unit.BFDamageLong > maxDamage[2] ) {
                        shouldRemove = true;
                    }
                    
                    // Armor/Structure range filters
                    else if( unit.BFArmor < minArmorStructure[0] || unit.BFArmor > maxArmorStructure[0] ) {
                        shouldRemove = true;
                    } else if( unit.BFStructure < minArmorStructure[1] || unit.BFStructure > maxArmorStructure[1] ) {
                        shouldRemove = true;
                    }
                    
                    // Year range filter
                    else if( parseInt(unit.DateIntroduced) < introDate[0] || parseInt(unit.DateIntroduced) > introDate[1] ) {
                        shouldRemove = true;
                    }
                    
                    // Movement filters
                    else if( minMove > -1 || maxMove < 999 ) {
                        // Parse movement string (e.g., "10"j", "8"/12"j", "10"")
                        let moveValue = 0;
                        if( unit.BFMove ) {
                            const moveMatch = unit.BFMove.match(/^(\d+)"?/);
                            if( moveMatch ) {
                                moveValue = parseInt(moveMatch[1]);
                            }
                        }
                        if( moveValue < minMove || moveValue > maxMove ) {
                            shouldRemove = true;
                        }
                    }
                    
                    // Jump filter
                    else if( minJump > -1 ) {
                        let hasJump = unit.BFMove && unit.BFMove.includes("j");
                        let jumpValue = 0;
                        if( hasJump ) {
                            // Extract jump value from strings like "10"j" or "8"/12"j"
                            const jumpMatch = unit.BFMove.match(/(\d+)"?j/);
                            if( jumpMatch ) {
                                jumpValue = parseInt(jumpMatch[1]);
                            }
                        }
                        if( jumpValue < minJump ) {
                            shouldRemove = true;
                        }
                    }
                    
                    // Defense filter (armor + structure)
                    else if( minDefense > -1 ) {
                        const totalDefense = unit.BFArmor + unit.BFStructure;
                        if( totalDefense < minDefense ) {
                            shouldRemove = true;
                        }
                    }
                    
                    // Exact damage profile filter
                    else if( exactDamageProfile ) {
                        if( exactDamageProfile.short !== -1 && unit.BFDamageShort !== exactDamageProfile.short ) {
                            shouldRemove = true;
                        } else if( exactDamageProfile.medium !== -1 && unit.BFDamageMedium !== exactDamageProfile.medium ) {
                            shouldRemove = true;
                        } else if( exactDamageProfile.long !== -1 && unit.BFDamageLong !== exactDamageProfile.long ) {
                            shouldRemove = true;
                        }
                    }
                    
                    // Enhanced ability filtering
                    else if( abilityExclude.length > 0 ) {
                        const unitAbilities = unit.BFAbilities ? unit.BFAbilities.toUpperCase().split(", ") : [];
                        
                        // Exclude abilities
                        for( let excludeAbility of abilityExclude ) {
                            if( unitAbilities.includes(excludeAbility.toUpperCase()) ) {
                                shouldRemove = true;
                                break;
                            }
                        }
                    }
                    
                    // Remove unit if it failed any filter
                    if( shouldRemove ) {
                        returnUnits.splice(i, 1);
                        i--;
                    }
                }
                console.log('Search Complete');
            })
        }

    } else {

        console.warn("Navigator is offline!")
    }
    return returnUnits;
}