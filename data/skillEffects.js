export const skillEffects = {
    stab: () => ({ type: "damage", value: 8 }),
    fireBreath: () => ({ type: "damage", value: 50 }),
    roar: () => ({ type: "debuff", stat: "defense", amount: -2 })
};
