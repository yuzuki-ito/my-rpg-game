import { getTotalStat } from "../utils/helpers.js";
import { player } from "../core/player.js";

// スキルツリー定義
export const skillTree = {
	fire: {
		name: "🔥 火の系統",
		skills: [
			{
				id: "ember",
				name: "エンバー",
				requiredLevel: 1,
				requires: null,
				cost: 2,
				mpCost: 2,
				canMiss: false,
				targetType: "enemy",
				description: "小さな火の玉で敵単体を攻撃する",
				ignoreDefense: true,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.5 + player.level * 0.2 + Math.random() * 1.1);
					return { type: "damage", value: damage, element: "fire" };
				}
			},
			{
				id: "flameLance",
				name: "フレイムランス",
				requiredLevel: 10,
				requires: "ember",
				cost: 4,
				mpCost: 18,
				canMiss: false,
				targetType: "enemy",
				description: "炎の槍で敵単体を貫く",
				ignoreDefense: true,
				scaling: "magic",
				cooldown: 6,
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 2.5 + player.level * 0.3 + Math.random() * 1.5);
					return { type: "damage", value: damage, element: "fire" };
				}
			},
			{
				id: "infernalEdge",
				name: "インフェルナルエッジ",
				requiredLevel: 20,
				requires: "flameLance",
				cost: 8,
				mpCost: 35,
				canMiss: false,
				targetType: "enemy",
				description: "灼熱の刃で敵単体に壊滅的なダメージを与える",
				ignoreDefense: true,
				scaling: "magic",
				cooldown: 12,
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 4 + player.level * 0.4 + Math.random() * 2.5);
					return { type: "damage", value: damage, element: "fire" };
				}
			}
		]
	},
	water: {
		name: "💧 水の系統",
		skills: [
			{
				id: "aquaShot",
				name: "アクアショット",
				requiredLevel: 2,
				requires: null,
				cost: 2,
				mpCost: 3,
				canMiss: false,
				targetType: "enemy",
				description: "水の弾で敵単体を攻撃する",
				ignoreDefense: false,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.5 + player.level * 0.2 + Math.random() * 1.1);
					return { type: "damage", value: damage, element: "water" };
				}
			},
			{
				id: "streamLance",
				name: "ストリームランス",
				requiredLevel: 11,
				requires: "aquaShot",
				cost: 4,
				mpCost: 14,
				canMiss: false,
				targetType: "enemy",
				description: "水流の槍で敵単体を貫く",
				ignoreDefense: false,
				scaling: "magic",
				cooldown: 4,
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 2.5 + player.level * 0.3 + Math.random() * 1.5);
					return { type: "damage", value: damage, element: "water" };
				}
			},
			{
				id: "aquaBurst",
				name: "アクアバースト",
				requiredLevel: 22,
				requires: "streamLance",
				cost: 8,
				mpCost: 28,
				canMiss: false,
				targetType: "enemy",
				description: "高圧の水流で敵単体に大ダメージを与える",
				ignoreDefense: false,
				scaling: "magic",
				cooldown: 8,
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 4 + player.level * 0.4 + Math.random() * 2.5);
					return { type: "damage", value: damage, element: "water" };
				}
			}
		]
	},
	wind: {
		name: "🍃 風の系統",
		skills: [
			{
				id: "windCutter",
				name: "ウィンドカッター",
				requiredLevel: 2,
				requires: null,
				cost: 2,
				mpCost: 2,
				canMiss: true,
				targetType: "enemy",
				description: "鋭い風の刃で敵単体を切り裂く",
				ignoreDefense: false,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.5 + player.level * 0.2 + Math.random() * 1.1);
					return { type: "damage", value: damage, element: "wind" };
				}
			},
			{
				id: "galeThrust",
				name: "ゲイルスラスト",
				requiredLevel: 12,
				requires: "windCutter",
				cost: 4,
				mpCost: 12,
				canMiss: true,
				targetType: "enemy",
				description: "突風の一撃で敵単体に強力なダメージを与える",
				ignoreDefense: false,
				scaling: "magic",
				cooldown: 3,
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 2.5 + player.level * 0.3 + Math.random() * 1.5);
					return { type: "damage", value: damage, element: "wind" };
				}
			},
			{
				id: "skyRend",
				name: "スカイレンド",
				requiredLevel: 21,
				requires: "galeThrust",
				cost: 8,
				mpCost: 25,
				canMiss: false,
				targetType: "enemy",
				description: "空を裂く風で敵単体に壊滅的なダメージを与える",
				ignoreDefense: false,
				scaling: "magic",
				cooldown: 8,
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 4 + player.level * 0.4 + Math.random() * 2.5);
					return { type: "damage", value: damage, element: "wind" };
				}
			}
		]
	},
	light: {
		name: "🌟 光の系統",
		skills: [
			{
				id: "lightArrow",
				name: "ライトアロー",
				requiredLevel: 3,
				requires: null,
				cost: 3,
				mpCost: 3,
				canMiss: false,
				targetType: "enemy",
				description: "光の矢で敵単体を貫く",
				ignoreDefense: true,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.5 + player.level * 0.2 + Math.random() * 1.1);
					return { type: "damage", value: damage, element: "light" };
				}
			},
			{
				id: "radiantBlade",
				name: "ラディアントブレード",
				requiredLevel: 14,
				requires: "lightArrow",
				cost: 6,
				mpCost: 22,
				canMiss: false,
				targetType: "enemy",
				description: "まばゆい光の刃で敵単体を斬り裂く",
				ignoreDefense: true,
				scaling: "magic",
				cooldown: 6,
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 2.5 + player.level * 0.3 + Math.random() * 1.5);
					return { type: "damage", value: damage, element: "light" };
				}
			},
			{
				id: "divineStrike",
				name: "ディバインストライク",
				requiredLevel: 22,
				requires: "radiantBlade",
				cost: 9,
				mpCost: 45,
				canMiss: false,
				targetType: "enemy",
				description: "神聖な光で敵単体に壊滅的なダメージを与える",
				ignoreDefense: true,
				scaling: "magic",
				cooldown: 12,
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 4 + player.level * 0.4 + Math.random() * 2.5);
					return { type: "damage", value: damage, element: "light" };
				}
			}
		]
	},
	dark: {
		name: "🌑 闇の系統",
		skills: [
			{
				id: "darkClaw",
				name: "ダーククロー",
				requiredLevel: 3,
				requires: null,
				cost: 3,
				mpCost: 3,
				canMiss: true,
				targetType: "enemy",
				description: "闇の爪で敵単体を切り裂く",
				ignoreDefense: false,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.5 + player.level * 0.2 + Math.random() * 1.1);
					return { type: "damage", value: damage, element: "dark" };
				}
			},
			{
				id: "voidSpike",
				name: "ヴォイドスパイク",
				requiredLevel: 8,
				requires: "darkClaw",
				cost: 6,
				mpCost: 18,
				canMiss: true,
				targetType: "enemy",
				description: "虚無の槍で敵単体を貫く強力な闇属性攻撃",
				ignoreDefense: true,
				scaling: "magic",
				cooldown: 5,
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 2.5 + player.level * 0.3 + Math.random() * 1.5);
					return { type: "damage", value: damage, element: "dark" };
				}
			},
			{
				id: "abyssRend",
				name: "アビスレンド",
				requiredLevel: 22,
				requires: "voidSpike",
				cost: 9,
				mpCost: 38,
				canMiss: false,
				targetType: "enemy",
				description: "深淵の力で敵単体に壊滅的な闇属性ダメージを与える",
				ignoreDefense: true,
				scaling: "magic",
				cooldown: 10,
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 4 + player.level * 0.4 + Math.random() * 2.5);
					return { type: "damage", value: damage, element: "dark" };
				}
			}
		]
	},
	heal: {
		name: "✨ 回復の系統",
		skills: [
			{
				id: "heal",
				name: "ヒール",
				requiredLevel: 1,
				requires: null,
				cost: 1,
				mpCost: 4,
				canMiss: false,
				targetType: "self",
				description: "HPを少し回復する",
				effect: () => {
					const recovery = Math.floor(player.level * 2 + 12);
					return { type: "heal", value: recovery };
				}
			},
			{
				id: "greaterHeal",
				name: "グレーターヒール",
				requiredLevel: 14,
				requires: "heal",
				cost: 5,
				mpCost: 22,
				canMiss: false,
				targetType: "self",
				description: "HPを中程度回復する",
				cooldown: 5,
				effect: () => {
					const recovery = Math.floor(player.level * 3 + 25);
					return { type: "heal", value: recovery };
				}
			},
			{
				id: "divineHeal",
				name: "ディバインヒール",
				requiredLevel: 25,
				requires: "greaterHeal",
				cost: 10,
				mpCost: 45,
				canMiss: false,
				targetType: "self",
				description: "HPを大きく回復する",
				cooldown: 10,
				effect: () => {
					const recovery = Math.floor(player.level * 4 + 40);
					return { type: "heal", value: recovery };
				}
			}
		]
	}
};
