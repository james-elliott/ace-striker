export const CONST_EDGE_ABILITIES = {
    nimble: {
        name: "Nimble",
        type: "Movement",
        restrictions: '',
        condition: 'When using ground or sprint movement',
        description: 'Spend 1 Edge to gain + 1 TMM, and you may move through enemy units this Movement Phase. If your printed TMM is 3 or more, this ability costs 2 Edge.'
    },
    marksman: {
        name: "Marksman",
        type: "Attack",
        restrictions: '',
        condition: 'After rolling for an attack',
        description: 'Spend 1 Edge to cause one attack roll of 11 that hits to allso infict a critical hit.'
    },
    jumpingjack: {
        name: "Jumping Jack",
        type: "Attack",
        restrictions: 'BM / CV Only',
        condition: 'When attacking a target at Short range, if you used jumping movement this turn',
        description: 'Spend 1 Edge to reduce your Target Number penalty for jumping to +1 (not +2).'
    },
    speeddemon: {
        name: "Speed Demon",
        type: "Movement",
        restrictions: '',
        condition: 'When using ground (or sprint) movement',
        description: 'Spend 1 Edge to gain +2" (or +4") movement this turn.'
    },
    assassin: {
        name: "Assassin",
        type: "Attack",
        restrictions: '',
        condition: 'Before rolling to attack a target in its rear arc',
        description: 'Spend 1 Edge to increase your damage rating by 1 (in addtion to the bonus 1 damage for attacking the target in the rear).'
    },
    forwardobserver: {
        name: "Forward Observer",
        type: "Indirect Fire",
        restrictions: '',
        condition: 'When spotting',
        description: 'Spend 1 Edge to also attack this Combat Phase without incurring the +1 penalty to the Target Number for you or any ally benefitting from your spotting.'
    },
    patient: {
        name: "Patient",
        type: "Attack",
        restrictions: '',
        condition: 'After rolling for an attack, if you used standstill movement this turn',
        description: 'Spend 1 Edge to reroll all of your dice.'
    },
    cautious: {
        name: "Cautious",
        type: "Defense",
        restrictions: 'BM / CV Only',
        condition: 'At the start of the Combat Phase',
        description: 'Spend 1 Edge to change your facing to any direction.'
    },
    protector: {
        name: "Protector",
        type: "Defense",
        restrictions: '',
        condition: 'When a friendly unit within 2" takes damage, if it is a smaller size than you',
        description: 'Spend 1 Edge to prevent 1 damage to that unit.'
    },
    coolantflush: {
        name: "Coolant Flush",
        type: "Heat",
        restrictions: 'BM Only',
        condition: 'During the End Phase',
        description: 'Spend up to 2 Edge to reduce your heat by the same amount.'
    },
    bulwark: {
        name: "Bulwark",
        type: "Melee",
        restrictions: 'BM / CV Only',
        condition: 'When you take damage from a Physical Attack (including self-inflicted damage from a DFA or Charge)',
        description: 'Spend 1 Edge to reduce the damage you receive by 1.'
    },
    meleespecialist: {
        name: "Melee Specialist",
        type: "Melee",
        restrictions: '',
        condition: 'After rolling for a Physical or MEL attack',
        description: 'Spend 1 Edge to reroll.'
    },
    forcecommander: {
        name: "Force Commander",
        type: "Special",
        restrictions: '',
        condition: 'While the Force Commander is destroyed',
        description: 'This force receives a -2 penalty to initiative.'
    },
}