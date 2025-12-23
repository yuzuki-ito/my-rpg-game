// helpers.js の先頭に追加
import { player } from "../core/player.js";


// レアリティ定義
export const rarityTable = {
	common: {
		label: "ノーマル",
		color: "white",
		colorCode: "#ffffff",
		namePrefix: {
			weapon: "古びた",
			armor: "ボロい"
		},
		critRate: 0.01,
		critMultiplier: 2,
		dropChance: 0.6
	},
	uncommon: {
		label: "アンコモン",
		color: "blue",
		colorCode: "#3399ff",
		namePrefix: {
			weapon: "鋭い",
			armor: "頑丈な"
		},
		critRate: 0.05,
		critMultiplier: 2,
		dropChance: 0.6
	},
	rare: {
		label: "レア",
		color: "gold",
		colorCode: "#FFD700",
		namePrefix: {
			weapon: "伝説の",
			armor: "神秘の"
		},
		critRate: 0.2,
		critMultiplier: 2.5,
		dropChance: 0.3
	}
};

// レアリティの順序（ソートや比較用）
export const rarityOrder = ["common", "uncommon", "rare"];

/**
 * レアリティをランダムに決定
 */
export function getRarity() {
	const roll = Math.random();
	if (roll > 0.9) return "rare";
	if (roll > 0.6) return "uncommon";
	return "common";
}

/**
 * レアリティのラベルを取得（UI表示用）
 * @param {string} rarity
 * @returns {string}
 */
export function getRarityLabel(rarity) {
	return rarityTable[rarity]?.label || "？？？";
}

// ランダム整数ユーティリティ
export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 装備ドロップを生成
 * @param {number} level - 敵のレベル
 * @param {string} rarity - "common" | "uncommon" | "rare"
 * @param {string|null} type - "weapon" | "armor" | null（nullならランダム）
 * @returns {Object} - ドロップ情報（type, item, chance）
 */
export function generateDrop(level, rarity, type = null) {
	const isWeapon = type === "weapon" ? true : type === "armor" ? false : Math.random() < 0.5;
	const data = rarityTable[rarity] || rarityTable.common;

	if (isWeapon) {
		return {
			type: "weapon",
			item: {
				name: `${data.namePrefix.weapon}剣`,
				attack: 2 + level + (rarity === "rare" ? 5 : rarity === "uncommon" ? 2 : 0),
				rarity,
				critRate: data.critRate,
				critMultiplier: data.critMultiplier
			},
			chance: data.dropChance
		};
	} else {
		return {
			type: "armor",
			item: {
				name: `${data.namePrefix.armor}防具`,
				defense: 1 + level + (rarity === "rare" ? 4 : rarity === "uncommon" ? 2 : 0),
				rarity
			},
			chance: data.dropChance
		};
	}
}

/**
 * ステータス合計（base, bonus, 装備などを合算）
 * @param  {...(number|object)} values - 数値または { permanent, temp } 形式の補正
 * @returns {number} - 合計値
 */
export function getTotalStat(...values) {
	return values.reduce((sum, val) => {
		if (typeof val === "number") {
			return sum + val;
		} else if (typeof val === "object" && val !== null) {
			const permanent = typeof val.permanent === "number" ? val.permanent : 0;
			const temp = typeof val.temp === "number" ? val.temp : 0;
			return sum + permanent + temp;
		}
		return sum;
	}, 0);
}

// リセット関数
export function resetTempBonuses(player) {
	const keys = [
		"attackBonus",
		"defenseBonus",
		"speedBonus",
		"accuracyBonus",
		"critBonus",
		"recoveryBonus",
		"magicBonus"
	];

	for (const key of keys) {
		const bonus = player[key];

		if (typeof bonus === "object" && bonus !== null) {
			// すでにオブジェクトなら temp をリセット
			bonus.temp = 0;
		} else {
			// 数値だった場合はオブジェクトに変換
			player[key] = { permanent: bonus || 0, temp: 0 };
		}
	}
}

// アイテムを生成する関数
export function createItem(base) {
	return {
		...base,
		id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
	};
}

// ID　または　名前と攻撃力（または防御力）が一致すれば「同じ装備」とみなす
export function isSameItem(a, b) {
	if (!a || !b) return false;

	// IDがあればIDで比較（推奨）
	if (a.id && b.id) {
		return a.id === b.id;
	}

	// IDがない場合は名前＋性能で比較（暫定）
	if (a.name !== b.name) return false;

	if ("attack" in a && "attack" in b) {
		return a.attack === b.attack;
	}
	if ("defense" in a && "defense" in b) {
		return a.defense === b.defense;
	}

	return false;
}
