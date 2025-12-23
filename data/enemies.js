import { rarityTable } from "../data/constants.js";
import { items } from "../data/item.js";
import { updateLog } from "../ui/log.js";

export const enemyPool = [
	// ====== 通常モンスター ======
	{
		id: "slime",
		name: "スライム",
		type: "slime",
		spawnRate: 0.68,
		baseLevel: 1,
		rarity: "common",
		hp: 18,
		baseAttack: 3,
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
		spawnRate: 0.3,
		baseLevel: 1,
		rarity: "uncommon",
		hp: 31,
		baseAttack: 4,
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
				chance: 0.5
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
		baseLevel: 1,
		rarity: "legendary",
		hp: 70,
		baseAttack: 2,
		defense: 15,
		baseSpeed: 15,
		baseAccuracy: 95,
		baseCrit: 10,
		exp: 150,
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
		baseLevel: 15,
		rarity: "boss",
		hp: 350,
		baseAttack: 35,
		defense: 15,
		baseSpeed: 15,
		baseAccuracy: 100,
		baseCrit: 15,
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
	},
	{
		id: "awakenedDragon",
		name: "覚醒ドラゴン",
		type: "boss",
		spawnRate: 0.0,
		baseLevel: 15,
		rarity: "legendary",
		hp: 750,
		baseAttack: 75,
		defense: 45,
		baseSpeed: 45,
		baseAccuracy: 100,
		baseCrit: 45,
		exp: 200,
		image: "images/awakened_dragon.png",
		dropTable: [
			{ type: "armor", item: items.dragonScaleCloak, chance: 0.03 },
			{ type: "weapon", item: items.dragonFangBlade, chance: 0.01 }
		],
		skills: [
			{ name: "灼熱の咆哮", effectId: "infernoRoar", chance: 0.5 }
		],
		onDefeatId: "awakenedDragonDefeat"
	},
	{
		id: "feralDragon",
		name: "凶暴なドラゴン",
		type: "boss",
		spawnRate: 0.0,
		baseLevel: 15,
		rarity: "rare",
		hp: 400,
		baseAttack: 40,
		defense: 18,
		baseSpeed: 18,
		baseAccuracy: 100,
		baseCrit: 18,
		exp: 150,
		image: "images/feral_dragon.png",
		dropTable: [], // 通常ドロップなし
		skills: [
			{ name: "獄炎", effectId: "hellfire", chance: 0.25 }
		],
		onDefeatId: "feralDragonDefeat"
	}

];
