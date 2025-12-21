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
    }
};

// ====== すべてのアイテムを統合してエクスポート ======
export const items = {
    ...weaponData,
    ...armorData,
    ...consumableData
};
