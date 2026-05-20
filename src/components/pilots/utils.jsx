export function getPilotSkill(pilot) {
  let skill = 4;
  if (pilot.skillSP >= 3400) {
    skill = 0;
  } else if (pilot.skillSP >= 1900) {
    skill = 1;
  } else if (pilot.skillSP >= 900) {
    skill = 2;
  } else if(pilot.skillSP >= 400) {
    skill = 3;
  }
  return skill;
}

export function getPilotTokens(pilot) {
  let tokens = 1;
  if (pilot.tokenSP >= 1100) {
    tokens = 10;
  } else if (pilot.tokenSP >= 900) {
    tokens = 9;
  } else if (pilot.tokenSP >= 720) {
    tokens = 8;
  } else if (pilot.tokenSP >= 560) {
    tokens = 7;
  } else if (pilot.tokenSP >= 420) {
    tokens = 6;
  } else if (pilot.tokenSP >= 300) {
    tokens = 5;
  } else if (pilot.tokenSP >= 200) {
    tokens = 4;
  } else if (pilot.tokenSP >= 120) {
    tokens = 3;
  } else if (pilot.tokenSP >= 60) {
    tokens = 2;
  }
  return tokens;
}