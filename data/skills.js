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
				cost: 1,
				mpCost: 3,
				canMiss: false,
				targetType: "enemy",
				description: "小さな火の玉で敵単体を攻撃する",
				ignoreDefense: true,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.0 + player.level * 1.2 + Math.random() * 3);
					return { type: "damage", value: damage, element: "fire" };
				}
			},
			{
				id: "flameLance",
				name: "フレイムランス",
				requiredLevel: 6,
				requires: "ember",
				cost: 2,
				mpCost: 7,
				canMiss: false,
				targetType: "enemy",
				description: "炎の槍で敵単体を貫く",
				ignoreDefense: true,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.6 + player.level * 2 + Math.random() * 5);
					return { type: "damage", value: damage, element: "fire" };
				}
			},
			{
				id: "infernalEdge",
				name: "インフェルナルエッジ",
				requiredLevel: 13,
				requires: "flameLance",
				cost: 3,
				mpCost: 12,
				canMiss: false,
				targetType: "enemy",
				description: "灼熱の刃で敵単体に壊滅的なダメージを与える",
				ignoreDefense: true,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 2.2 + player.level * 3 + Math.random() * 8);
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
				cost: 1,
				mpCost: 3,
				canMiss: false,
				targetType: "enemy",
				description: "水の弾で敵単体を攻撃する",
				ignoreDefense: false,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.0 + player.level * 1.2 + Math.random() * 3);
					return { type: "damage", value: damage, element: "water" };
				}
			},
			{
				id: "streamLance",
				name: "ストリームランス",
				requiredLevel: 7,
				requires: "aquaShot",
				cost: 2,
				mpCost: 7,
				canMiss: false,
				targetType: "enemy",
				description: "水流の槍で敵単体を貫く",
				ignoreDefense: false,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.5 + player.level * 2 + Math.random() * 5);
					return { type: "damage", value: damage, element: "water" };
				}
			},
			{
				id: "aquaBurst",
				name: "アクアバースト",
				requiredLevel: 14,
				requires: "streamLance",
				cost: 3,
				mpCost: 12,
				canMiss: false,
				targetType: "enemy",
				description: "高圧の水流で敵単体に大ダメージを与える",
				ignoreDefense: false,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 2.0 + player.level * 3 + Math.random() * 8);
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
				cost: 1,
				mpCost: 3,
				canMiss: true,
				targetType: "enemy",
				description: "鋭い風の刃で敵単体を切り裂く",
				ignoreDefense: false,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.0 + player.level * 1.2 + Math.random() * 4);
					return { type: "damage", value: damage, element: "wind" };
				}
			},
			{
				id: "galeThrust",
				name: "ゲイルスラスト",
				requiredLevel: 7,
				requires: "windCutter",
				cost: 2,
				mpCost: 7,
				canMiss: true,
				targetType: "enemy",
				description: "突風の一撃で敵単体に強力なダメージを与える",
				ignoreDefense: false,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.5 + player.level * 2 + Math.random() * 6);
					return { type: "damage", value: damage, element: "wind" };
				}
			},
			{
				id: "skyRend",
				name: "スカイレンド",
				requiredLevel: 14,
				requires: "galeThrust",
				cost: 3,
				mpCost: 12,
				canMiss: false,
				targetType: "enemy",
				description: "空を裂く風で敵単体に壊滅的なダメージを与える",
				ignoreDefense: false,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 2.0 + player.level * 3 + Math.random() * 10);
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
				cost: 1,
				mpCost: 4,
				canMiss: false,
				targetType: "enemy",
				description: "光の矢で敵単体を貫く",
				ignoreDefense: true,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.0 + player.level * 1.5 + Math.random() * 4);
					return { type: "damage", value: damage, element: "light" };
				}
			},
			{
				id: "radiantBlade",
				name: "ラディアントブレード",
				requiredLevel: 9,
				requires: "lightArrow",
				cost: 2,
				mpCost: 8,
				canMiss: false,
				targetType: "enemy",
				description: "まばゆい光の刃で敵単体を斬り裂く",
				ignoreDefense: true,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.6 + player.level * 2 + Math.random() * 6);
					return { type: "damage", value: damage, element: "light" };
				}
			},
			{
				id: "divineStrike",
				name: "ディバインストライク",
				requiredLevel: 16,
				requires: "radiantBlade",
				cost: 3,
				mpCost: 14,
				canMiss: false,
				targetType: "enemy",
				description: "神聖な光で敵単体に壊滅的なダメージを与える",
				ignoreDefense: true,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 2.3 + player.level * 3 + Math.random() * 10);
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
				cost: 1,
				mpCost: 4,
				canMiss: true,
				targetType: "enemy",
				description: "闇の爪で敵単体を切り裂く",
				ignoreDefense: false,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.0 + player.level * 1.5 + Math.random() * 4);
					return { type: "damage", value: damage, element: "dark" };
				}
			},
			{
				id: "voidSpike",
				name: "ヴォイドスパイク",
				requiredLevel: 8,
				requires: "darkClaw",
				cost: 2,
				mpCost: 8,
				canMiss: true,
				targetType: "enemy",
				description: "虚無の槍で敵単体を貫く強力な闇属性攻撃",
				ignoreDefense: true,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 1.5 + player.level * 2 + Math.random() * 6);
					return { type: "damage", value: damage, element: "dark" };
				}
			},
			{
				id: "abyssRend",
				name: "アビスレンド",
				requiredLevel: 15,
				requires: "voidSpike",
				cost: 3,
				mpCost: 14,
				canMiss: false,
				targetType: "enemy",
				description: "深淵の力で敵単体に壊滅的な闇属性ダメージを与える",
				ignoreDefense: true,
				scaling: "magic",
				effect: () => {
					const magic = getTotalStat(player.magic, player.magicBonus, player.weapon?.magic || 0);
					const damage = Math.floor(magic * 2.2 + player.level * 3 + Math.random() * 10);
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
					const recovery = Math.floor(player.level * 2 + 10); // 例：Lv5で20回復
					return { type: "heal", value: recovery };
				}
			},
			{
				id: "greaterHeal",
				name: "グレーターヒール",
				requiredLevel: 7,
				requires: "heal",
				cost: 2,
				mpCost: 8,
				canMiss: false,
				targetType: "self",
				description: "HPを中程度回復する",
				effect: () => {
					const recovery = Math.floor(player.level * 3 + 20); // 例：Lv10で50回復
					return { type: "heal", value: recovery };
				}
			},
			{
				id: "divineHeal",
				name: "ディバインヒール",
				requiredLevel: 14,
				requires: "greaterHeal",
				cost: 3,
				mpCost: 14,
				canMiss: false,
				targetType: "self",
				description: "HPを大きく回復する",
				effect: () => {
					const recovery = Math.floor(player.level * 4 + 40); // 例：Lv15で100回復
					return { type: "heal", value: recovery };
				}
			}
		]
	}
};
