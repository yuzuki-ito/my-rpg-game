import { updateLog } from "../ui/log.js";
import { updateStatus } from "../ui/status.js";
import { player } from "./player.js";
import { addItemToInventory } from "./inventory.js";
import { playSE } from "./audio.js";

// レアリティに応じたログカラー
const rarityColors = {
	common: "black",
	rare: "blue",
	epic: "purple",
	legendary: "gold"
};

// 宝箱の種類に応じた効果音とログ
const chestTypes = {
	normal: { se: "se-treasure", log: "📦 宝箱を開けた！" },
	silver: { se: "se-treasure-silver", log: "🔷 銀の宝箱を開けた！" },
	gold: { se: "se-treasure-gold", log: "✨ 豪華な宝箱を開けた！" }
};

/**
 * 宝箱を開けて報酬を獲得する
 * @param {Object} reward - 獲得アイテム（name, type, rarity などを含む）
 * @param {string} chestType - 宝箱の種類（例："normal", "silver", "gold"）
 */
export function openTreasureChest(reward, chestType = "normal") {
	if (!reward || typeof reward.name !== "string") {
		console.warn("無効な報酬が指定されました");
		return;
	}

	const chest = chestTypes[chestType] || chestTypes.normal;

	// 効果音とログ
	playSE(chest.se);
	updateLog(chest.log);

	const color = rarityColors[reward.rarity] || "white";
	updateLog(`🎁 ${reward.name} を手に入れた！`, color);

	// 所持品に追加
	addItemToInventory(reward);

	// 自動装備処理マップ
	const autoEquip = {
		weapon: {
			slot: "weapon",
			icon: "🗡️"
		},
		armor: {
			slot: "armor",
			icon: "🛡️"
		}
	};

	const equip = autoEquip[reward.type];
	if (equip) {
		player[equip.slot] = reward;
		updateLog(`${equip.icon} 『${reward.name}』を装備した！`, "green");
		updateStatus();
	}
}
