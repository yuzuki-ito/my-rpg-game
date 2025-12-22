import { rarityTable } from "../data/constants.js";
import { items } from "../data/item.js";
import { updateLog } from "../ui/log.js";

export const enemyPool = [
	// ====== 通常モンスター ======
	{
		id: "slime",
		name: "スライム",
		type: "slime",
		spawnRate: 0.75,
		baseLevel: 1,
		rarity: "common",
		hp: 20,
		baseAttack: 4,
		defense: 1,
		baseSpeed: 2,
		baseAccuracy: 85,
		baseCrit: 1,
		exp: 2,
		image: "images/slime.png",
		dropTable: [
			{
				type: "armor",
				item: items.rustyArmor,
				chance: 0.5
			}
		]
	},

	{
		id: "goblin",
		name: "ゴブリン",
		type: "goblin",
		spawnRate: 0.2,
		baseLevel: 2,
		rarity: "uncommon",
		hp: 29,
		baseAttack: 6,
		defense: 2,
		baseSpeed: 3,
		baseAccuracy: 89,
		baseCrit: 0.9,
		exp: 6,
		image: "images/goblin.png",
		dropTable: [
			{
				type: "weapon",
				item: items.sharpSword,
				chance: 0.3
			}
		],
		skills: [
			{
				name: "突き刺し",
				effectId: "stab",
				chance: 0.25
			}
		]
	},

	// ====== レアモンスター ======
	{
		id: "goldenslime",
		name: "ゴールデンスライム",
		type: "goldenslime",
		spawnRate: 0.02,
		baseLevel: 5,
		rarity: "legendary",
		hp: 50,
		baseAttack: 10,
		defense: 10,
		baseSpeed: 10,
		baseAccuracy: 95,
		baseCrit: 10,
		exp: 50,
		image: "images/goldenslime.png",
		dropTable: [
			{
				type: "weapon",
				item: items.goldenSword,
				chance: 0.05
			}
		],
		onDefeatId: "goldenslimeDefeat"
	},

	// ====== ボスモンスター ======
	{
		id: "dragon",
		name: "ドラゴン",
		type: "boss",
		spawnRate: 0.0,
		baseLevel: 10,
		rarity: "epic",
		hp: 300,
		baseAttack: 30,
		defense: 15,
		baseSpeed: 10,
		baseAccuracy: 100,
		baseCrit: 10,
		exp: 100,
		image: "images/dragon.png",
		dropTable: [
			{
				type: "armor",
				item: items.dragonArmor,
				chance: 1.0
			}
		],
		skills: [
			{
				name: "火炎の息",
				effectId: "fireBreath",
				chance: 0.4
			},
			{
				name: "咆哮",
				effectId: "roar",
				chance: 0.2
			}
		],
		onDefeatId: "dragonDefeat"
	}
];
