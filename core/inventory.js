import { updateLog } from "../ui/log.js";
import { updateStatus } from "../ui/status.js";
import { showInventoryMenu } from "../ui/inventoryMenu.js";
import { player } from "./player.js";
import { MAX_INVENTORY } from "../data/constants.js"; // 外部定義に切り出し推奨

// レアリティに応じたログカラー
const rarityColors = {
	common: "black",
	rare: "blue",
	epic: "purple",
	legendary: "gold"
};

// タイプラベル（表示用）
const typeLabels = {
	weapon: "（武器）",
	armor: "（防具）"
};

function getInventoryCount() {
	return player.inventory.weapons.length + player.inventory.armors.length;
}

/**
 * アイテムをインベントリに追加する（装備・所持数チェック・ログ出力）
 * @param {Object} item - 追加するアイテム（type, name, rarity）
 * @param {boolean} autoEquip - 自動装備するかどうか（デフォルト: false）
 * @returns {boolean} - 成功したかどうか
 */
export function addItemToInventory(item, autoEquip = false) {
	console.log("追加しようとしているアイテム:", item);

	if (!item || typeof item.name !== "string" || typeof item.type !== "string") {
		console.warn("無効なアイテムが指定されました:", item);
		return false;
	}

	const typeLabel = typeLabels[item.type] || "";
	const currentCount = getInventoryCount();

	if (currentCount >= MAX_INVENTORY) {
		updateLog(`📦 ${item.name}${typeLabel} を拾えなかった（所持数がいっぱい）`, "info");
		updateLog("🧹 所持品を整理してください！", "warning");
		showInventoryMenu();
		return false;
	}

	console.log("インベントリ構造:", player.inventory);
	const list = player.inventory[item.type + "s"];
	if (!Array.isArray(list)) {
		console.warn(`未対応のアイテムタイプ: ${item.type}`);
		return false;
	}

	list.push(item);

	const color = rarityColors[item.rarity] || "white";
	//updateLog(`📦 ${item.name}${typeLabel} を手に入れた！`, color);

	let equipped = false;

	if (autoEquip && (item.type === "weapon" || item.type === "armor")) {
		player[item.type] = item;
		const icon = item.type === "weapon" ? "🗡️" : "🛡️";
		updateLog(`${icon} 『${item.name}』を装備した！`, "info");
		equipped = true;
	}

	const remaining = MAX_INVENTORY - getInventoryCount();
	if (remaining <= 2) {
		updateLog(`⚠️ 所持品が残り ${remaining} 枠です！`, "warning");
		if (remaining === 0) {
			showInventoryMenu();
		}
	}

	if (equipped || remaining <= 2) {
		updateStatus();
	}

	return true;
}

// 自動装備を完全に禁止
export function obtainEquipment(type, item) {
	item.type = type; // 必要ならここで明示的に設定
	console.log("装備追加:", item);
	return addItemToInventory(item, false);
	updateStatus();
}

// 所持品（インベントリ）画面を開いたときに現在のアイテムと装備の状態を表示するための関数
export function renderInventory() {
	const inventoryMenu = document.getElementById("inventory-menu");
	inventoryMenu.innerHTML = ""; // いったん中身をクリア

	const title = document.createElement("h3");
	title.textContent = `所持品（${player.items.length} / ${player.maxItems}）`;
	inventoryMenu.appendChild(title);

	// 武器セクション
	const weaponHeader = document.createElement("div");
	weaponHeader.textContent = "武器";
	inventoryMenu.appendChild(weaponHeader);

	player.weapons.forEach((weapon) => {
		const itemDiv = document.createElement("div");
		itemDiv.className = "inventory-item";

		const isEquipped = player.weapon?.name === weapon.name;

		const label = document.createElement("div");
		label.className = "item-label";
		label.textContent = isEquipped ? `★${weapon.name}（攻撃+${weapon.attack}）` : `${weapon.name}（攻撃+${weapon.attack}）`;

		const buttons = document.createElement("div");
		buttons.className = "button-group";

		if (isEquipped) {
			const equippedLabel = document.createElement("span");
			equippedLabel.textContent = "装備中";
			equippedLabel.className = "green small-button";
			buttons.appendChild(equippedLabel);
		} else {
			const equipBtn = document.createElement("button");
			equipBtn.textContent = "装備";
			equipBtn.className = "button small-button";
			equipBtn.onclick = () => equipWeapon(weapon);
			buttons.appendChild(equipBtn);
		}

		const dropBtn = document.createElement("button");
		dropBtn.textContent = "捨てる";
		dropBtn.className = "button small-button";
		dropBtn.onclick = () => dropWeapon(weapon);
		buttons.appendChild(dropBtn);

		itemDiv.appendChild(label);
		itemDiv.appendChild(buttons);
		inventoryMenu.appendChild(itemDiv);
	});

	// 防具も同様に追加（省略）
}
