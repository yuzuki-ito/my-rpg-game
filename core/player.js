import { initializeQuests } from "./quest.js";
import { drawMap } from "./map.js";
import { updateStatus } from "../ui/status.js";
import { generateMaps } from "../data/mapData.js";
import { weaponData } from "../data/item.js";

// プレイヤーの状態を保持（参照は固定）
export let player = {};

// 初期装備のIDを指定
const STARTING_ITEM_IDS = ["woodenStick"];

// 初期ステータス定義（再利用可能）
const defaultPlayerData = {
	// 基本情報
	name: "勇者",
	level: 1,
	hp: 24,
	maxHp: 24,
	mp: 8,
	maxMp: 8,
	magic: 4,

	// ステータス（基本＋補正）
	baseAttack: 4, attackBonus: {
		permanent: 0, // ステータス強化などで増えた分（永続）
		temp: 0 // 戦闘中の一時的な補正（スキルなど）
	},
	baseDefense: 2, defenseBonus: {
		permanent: 0, // ステータス強化などで増えた分（永続）
		temp: 0 // 戦闘中の一時的な補正（スキルなど）
	},
	baseSpeed: 4, speedBonus: {
		permanent: 0, // ステータス強化などで増えた分（永続）
		temp: 0 // 戦闘中の一時的な補正（スキルなど）
	},
	baseAccuracy: 88, accuracyBonus: {
		permanent: 0, // ステータス強化などで増えた分（永続）
		temp: 0 // 戦闘中の一時的な補正（スキルなど）
	},
	baseCrit: 3, critBonus: {
		permanent: 0, // ステータス強化などで増えた分（永続）
		temp: 0 // 戦闘中の一時的な補正（スキルなど）
	},
	baseRecovery: 4, recoveryBonus: {
		permanent: 0, // ステータス強化などで増えた分（永続）
		temp: 0 // 戦闘中の一時的な補正（スキルなど）
	},
	baseMagic: 4, magicBonus: {
		permanent: 0, // ステータス強化などで増えた分（永続）
		temp: 0 // 戦闘中の一時的な補正（スキルなど）
	},

	// 成長・装備・スキル
	exp: 0,
	nextExp: 10,
	potions: 1,
	skills: {
		learned: [],     // 習得済みスキルID
		points: 0        // スキルポイント
	},
	skillCooldowns: {}, // ← ここを追加！
	weapon: null,
	armor: null,

	// 位置・進行状況（マップID付き）
	location: {
		mapId: "main",
		x: 0,
		y: 0
	},
	inventory: {
		weapons: STARTING_ITEM_IDS.map(id => ({ ...weaponData[id] })),
		armors: []
	},
	quests: {},
	questStarted: false,
	questCompleted: false,
	slimeDefeated: 0,
	returnPoint: null, // ← 追加！

	// 行動制限
	potionUsedThisTurn: false,
	actionTakenThisStep: false,
	lastGatherPosition: null,

	// 探索中の行動制限（←ここを追加！）
	potionUsedInField: false,
	restedInField: false,

	// 1マスの行動制限
	potionUsedThisStep: false,
	restedThisStep: false

};

/**
 * プレイヤーを初期化する
 */
export function initPlayer() {
	Object.assign(player, JSON.parse(JSON.stringify(defaultPlayerData)));
	player.weapon = player.inventory.weapons[0] || null;
}

/**
 * セーブデータからプレイヤーを復元する
 * @param {Object} data - セーブデータ
 */
export function setPlayerData(data) {
	Object.assign(player, data);
}

/**
 * セーブ用にプレイヤーデータを取得する
 * @returns {Object} - 保存対象のプレイヤーデータ
 */
export function getPlayerData() {
	return JSON.parse(JSON.stringify(player));
}

/**
 * ゲーム全体の初期化（プレイヤー＋クエスト＋UI）
 */
export function initGame() {
	console.log("初期化開始！");
	initPlayer();
	generateMaps(player); // ← ここでマップを生成！
	initializeQuests();
	drawMap();
	updateStatus();
}
