// ====== ステータス成長定義（成長傾向・カテゴリ・説明付き） ======
export const levelUpStats = [
	{
		key: "attack",
		label: "攻撃力",
		min: 1,
		max: 3,
		weight: 1.2,
		category: "offense",
		description: "敵に与えるダメージ量に影響"
	},
	{
		key: "defense",
		label: "防御力",
		min: 1,
		max: 3,
		weight: 1.0,
		category: "defense",
		description: "受けるダメージを軽減する"
	},
	{
		key: "speed",
		label: "すばやさ",
		min: 1,
		max: 3,
		weight: 0.9,
		category: "utility",
		description: "行動順や回避率に影響"
	},
	{
		key: "crit",
		label: "会心率",
		min: 1,
		max: 3,
		weight: 0.8,
		category: "offense",
		description: "クリティカルの発生率に影響"
	},
	{
		key: "accuracy",
		label: "命中率",
		min: 1,
		max: 3,
		weight: 1.0,
		category: "utility",
		description: "攻撃の命中しやすさに影響"
	},
	{
		key: "recovery",
		label: "回復力",
		min: 1,
		max: 3,
		weight: 0.7,
		category: "support",
		description: "回復アイテムやスキルの効果量に影響"
	}
];

// ====== レアリティ定義（色・ドロップ率・補正・演出） ======
export const rarityTable = {
	common: {
		label: "ノーマル",
		color: "#999999",
		dropRate: 0.6,
		critRate: 0.01,
		critMultiplier: 2,
		valueMultiplier: 1,
		namePrefix: {
			weapon: "古びた",
			armor: "ボロい"
		},
		icon: "⚪"
	},
	uncommon: {
		label: "アンコモン",
		color: "#2e7d32",
		dropRate: 0.3,
		critRate: 0.05,
		critMultiplier: 2,
		valueMultiplier: 1.5,
		namePrefix: {
			weapon: "鋭い",
			armor: "頑丈な"
		},
		icon: "🟢"
	},
	rare: {
		label: "レア",
		color: "#1565c0",
		dropRate: 0.1,
		critRate: 0.1,
		critMultiplier: 2.5,
		valueMultiplier: 2,
		namePrefix: {
			weapon: "伝説の",
			armor: "神秘の"
		},
		icon: "🔵"
	},
	epic: {
		label: "エピック",
		color: "#6a1b9a",
		dropRate: 0.03,
		critRate: 0.15,
		critMultiplier: 3,
		valueMultiplier: 2.5,
		namePrefix: {
			weapon: "神々の",
			armor: "魔法の"
		},
		icon: "🟣"
	},
	legendary: {
		label: "レジェンド",
		color: "#ef6c00",
		dropRate: 0.01,
		critRate: 0.2,
		critMultiplier: 3.5,
		valueMultiplier: 3,
		namePrefix: {
			weapon: "英雄の",
			armor: "伝承の"
		},
		icon: "🟠"
	}
};

// ====== インベントリ関連 ======
export const MAX_INVENTORY = 10;

// ====== ログ関連 ======
export const MAX_LOG_ENTRIES = 50;
export const ENABLE_TIMESTAMP = false;

// ====== プレイヤー初期設定 ======
export const DEFAULT_PLAYER_NAME = "勇者";

export const DEFAULT_WEAPON = {
	id: "woodenStick",
	name: "木の棒",
	type: "weapon",
	attack: 2,
	accuracy: 5,
	critRate: 0.03,
	critMultiplier: 1.5,
	rarity: "common",
	icon: "🪵"
};
