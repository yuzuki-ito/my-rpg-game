// ====== 武器データ ======
export const weaponData = {
    woodenStick: {
        id: "woodenStick",
        name: "木の棒",
        type: "weapon",
        attack: 2,
        accuracy: 5,
        critRate: 0.03,
        critMultiplier: 1.5,
        rarity: "common",
        price: 10,
        icon: "🪵",
        tags: ["starter"]
    },
    sharpSword: {
        id: "sharpSword",
        name: "鋭い剣",
        type: "weapon",
        attack: 5,
        accuracy: 10,
        critRate: 0.1,
        critMultiplier: 2,
        rarity: "uncommon",
        price: 50,
        icon: "🗡️",
        tags: ["sharp"]
    },
    goldenSword: {
        id: "goldenSword",
        name: "黄金の剣",
        type: "weapon",
        attack: 30,
        accuracy: 15,
        critRate: 0.3,
        critMultiplier: 3,
        rarity: "legendary",
        price: 999,
        icon: "⚔️",
        tags: ["legendary", "shiny"]
    },
    cursedDagger: {
        id: "cursedDagger",
        name: "呪われた短剣",
        type: "weapon",
        attack: 12,
        accuracy: 20,
        critRate: 0.4,
        critMultiplier: 2,
        rarity: "rare",
        price: 120,
        icon: "🗡️",
        tags: ["cursed", "risky"],
        description: "高いクリティカル率を持つが、装備中は最大HPが10%減少する"
    },
    frostBlade: {
        id: "frostBlade",
        name: "氷の刃",
        type: "weapon",
        attack: 18,
        accuracy: 12,
        critRate: 0.15,
        critMultiplier: 2,
        rarity: "rare",
        price: 180,
        icon: "❄️",
        tags: ["ice", "elemental"],
        description: "攻撃時に10%の確率で敵を凍結させる"
    }

};

// ====== 防具データ ======
export const armorData = {
    rustyArmor: {
        id: "rustyArmor",
        name: "ボロい防具",
        type: "armor",
        defense: 1,
        rarity: "common",
        price: 15,
        icon: "🛡️",
        tags: ["starter"]
    },
    sturdyArmor: {
        id: "sturdyArmor",
        name: "頑丈な防具",
        type: "armor",
        defense: 4,
        rarity: "uncommon",
        price: 60,
        icon: "🛡️",
        tags: ["heavy"]
    },
    dragonArmor: {
        id: "dragonArmor",
        name: "ドラゴンアーマー",
        type: "armor",
        defense: 10,
        rarity: "rare",
        price: 300,
        icon: "🐉",
        tags: ["dragon", "rare"]
    },
    shadowCloak: {
        id: "shadowCloak",
        name: "影のマント",
        type: "armor",
        defense: 3,
        rarity: "rare",
        price: 150,
        icon: "🕶️",
        tags: ["evasion", "stealth"],
        description: "回避率が10%上昇する"
    },
    holyArmor: {
        id: "holyArmor",
        name: "聖なる鎧",
        type: "armor",
        defense: 8,
        rarity: "epic",
        price: 400,
        icon: "✨",
        tags: ["holy", "resist"],
        description: "闇属性のダメージを半減する"
    }

};

// ====== 消費アイテムデータ ======
export const consumableData = {
    potion: {
        id: "potion",
        name: "ポーション",
        type: "consumable",
        description: "HPを30回復する",
        effect: { type: "heal", value: 30 },
        rarity: "common",
        price: 20,
        icon: "🧪",
        tags: ["healing"]
    },
    ether: {
        id: "ether",
        name: "エーテル",
        type: "consumable",
        description: "MPを20回復する",
        effect: { type: "restoreMp", value: 20 },
        rarity: "uncommon",
        price: 40,
        icon: "🔮",
        tags: ["magic", "healing"]
    },
    elixir: {
        id: "elixir",
        name: "エリクサー",
        type: "consumable",
        description: "HPとMPを完全に回復する",
        effect: { type: "fullRestore" },
        rarity: "legendary",
        price: 300,
        icon: "💎",
        tags: ["healing", "rare"]
    },
    smokeBomb: {
        id: "smokeBomb",
        name: "スモークボム",
        type: "consumable",
        description: "戦闘から確実に逃げられる",
        effect: { type: "escape" },
        rarity: "uncommon",
        price: 50,
        icon: "💨",
        tags: ["utility"]
    }

};

// ====== すべてのアイテムを統合してエクスポート ======
export const items = {
    ...weaponData,
    ...armorData,
    ...consumableData
};
