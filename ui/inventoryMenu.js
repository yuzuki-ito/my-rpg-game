import { updateLog } from "./log.js";
import { updateStatus } from "./status.js";
import { player } from "../core/player.js";
import { MAX_INVENTORY } from "../data/constants.js"; // 外部定義に切り出し推奨
import { toggleStatus } from "./status.js";
import { isSameItem } from "../utils/helpers.js";

// レアリティに応じたログカラー
const rarityColors = {
	common: "black",
	rare: "blue",
	epic: "purple",
	legendary: "gold"
};

// 数値→文字列に変換するマッピング
const rarityMap = {
	1: "common",
	2: "rare",
	3: "epic",
	4: "legendary"
};

// 装備品一覧画面
export function showInventoryMenu() {
	const menu = document.getElementById("inventory-menu");
	const bg = document.getElementById("modal-bg");
	if (!menu || !bg) return;

	const weapons = player.inventory.weapons;
	const armors = player.inventory.armors;
	const totalCount = weapons.length + armors.length;

	menu.innerHTML = `<h3>🎒 所持品（${totalCount} / ${MAX_INVENTORY}）</h3>`;
	menu.classList.add("modal-window");

	if (totalCount >= MAX_INVENTORY - 2) {
		const hint = document.createElement("p");
		hint.innerHTML = `🧹 所持品がいっぱいです。<strong>「捨てる」</strong>や<strong>「合成」</strong>で整理しましょう！`;
		hint.style.cssText = "margin-bottom:10px; font-size:0.9em; color:#555;";
		menu.appendChild(hint);
	}

	const createItemRow = (item, index, type) => {
		const wrapper = document.createElement("div");
		wrapper.classList.add("inventory-item");

		const list = player.inventory[type + "s"];

		const isEquipped = (type === "weapon" && isSameItem(player.weapon, item)) ||
			(type === "armor" && isSameItem(player.armor, item));

		const label = isEquipped ? "★" : "";
		const stat = type === "weapon" ? `攻撃+${item.attack}` : `防御+${item.defense}`;
		const rarityKey = rarityMap[item.rarity] || "common";

		// 左側：アイテム名
		const upgradeLabel = item.upgradeCount ? `+${item.upgradeCount}` : "";
		const fullText = `${label}${item.name}${upgradeLabel}（${stat}）`;
		const info = document.createElement("span");
		info.classList.add("item-label");
		info.textContent = fullText;
		info.title = fullText; // ← これがツールチップになる！
		info.style.color = rarityColors[rarityKey] || "black";

		// 右側：ボタン群
		const buttonGroup = document.createElement("div");
		buttonGroup.classList.add("button-group");

		const equipBtn = document.createElement("button");
		equipBtn.textContent = isEquipped ? "装備中" : "装備";
		equipBtn.classList.add("button", "small-button");
		if (isEquipped) equipBtn.classList.add("green");
		equipBtn.onclick = () => {
			if (type === "weapon") player.weapon = item;
			else player.armor = item;
			updateLog(`『${item.name}』を装備した！`, "info");
			updateStatus();
			showInventoryMenu();
		};
		buttonGroup.appendChild(equipBtn);

		const dropBtn = document.createElement("button");
		dropBtn.textContent = "捨てる";
		dropBtn.classList.add("button", "small-button");
		dropBtn.onclick = () => {
			if (isEquipped) {
				if (type === "weapon") player.weapon = null;
				else player.armor = null;
				updateLog(`『${item.name}』を外した`, "info");
			}
			player.inventory[type + "s"] = list.filter(i => i !== item);
			updateLog(`${item.name} を捨てた`, "info");
			updateStatus();
			refreshStatusScreen();
			showInventoryMenu();
		};
		buttonGroup.appendChild(dropBtn);

		if (isEquipped) {
			const unequipBtn = document.createElement("button");
			unequipBtn.textContent = "外す";
			unequipBtn.classList.add("button", "small-button", "gray");

			unequipBtn.onclick = () => {
				if (type === "weapon") {
					player.weapon = null;
				} else {
					player.armor = null;
				}
				updateLog(`『${item.name}』を外した`, "info");
				updateStatus();
				showInventoryMenu();
			};

			buttonGroup.appendChild(unequipBtn);
		}

		const sameCount = list.filter(i =>
			i.name === item.name &&
			!isSameItem(player.weapon, i) &&
			!isSameItem(player.armor, i)
		).length;
		if (sameCount >= 2 && !isEquipped) {
			const combineBtn = document.createElement("button");
			combineBtn.textContent = `合成（${sameCount}）`;
			combineBtn.classList.add("button", "small-button");
			combineBtn.onclick = () => {
				const upgradeLimit = 5;
				const currentCount = item.upgradeCount || 0;

				if (currentCount >= upgradeLimit) {
					updateLog(`⚠️ ${item.name} はこれ以上合成できません（最大+${upgradeLimit}）`, "warning");
					return;
				}

				// 🔒 装備中を除いた素材を抽出
				const availableMaterials = list.filter(i =>
					i.name === item.name &&
					!isSameItem(player.weapon, i) &&
					!isSameItem(player.armor, i)
				);

				if (availableMaterials.length < 2) {
					updateLog(`⚠️ 合成には同じ装備が2つ以上必要です（装備中のものは使えません）`, "warning");
					return;
				}

				// 🎲 失敗判定
				const failureRate = Math.min(0.1 * currentCount, 0.5);
				if (Math.random() < failureRate) {
					// 合成失敗：素材2つ削除
					let removed = 0;
					player.inventory[type + "s"] = list.filter(i => {
						if (
							i.name === item.name &&
							!isSameItem(player.weapon, i) &&
							!isSameItem(player.armor, i) &&
							removed < 2
						) {
							removed++;
							return false;
						}
						return true;
					});
					updateLog(`💥 合成失敗！${item.name} は壊れてしまった…`, "error");
					updateStatus();
					refreshStatusScreen();
					showInventoryMenu();
					return;
				}

				// 合成成功：素材2つ削除＋強化装備作成
				let removed = 0;
				player.inventory[type + "s"] = list.filter(i => {
					if (
						i.name === item.name &&
						!isSameItem(player.weapon, i) &&
						!isSameItem(player.armor, i) &&
						removed < 2
					) {
						removed++;
						return false;
					}
					return true;
				});

				const upgraded = {
					...item,
					name: item.name + "＋",
					rarity: Math.min((item.rarity || 1) + 1, 5),
					upgradeCount: currentCount + 1,
					id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
				};

				if (type === "weapon") upgraded.attack += 1;
				else upgraded.defense += 1;

				player.inventory[type + "s"].push(upgraded);
				updateLog(`✨ 合成成功！${upgraded.name}（+${upgraded.upgradeCount}）を作成！`, "success");
				updateStatus();
				refreshStatusScreen();
				showInventoryMenu();

				const lastItem = menu.querySelector(".inventory-item:last-child");
				if (lastItem) lastItem.classList.add("fade-in");
			};
			buttonGroup.appendChild(combineBtn);
		}

		// 並べて追加
		wrapper.appendChild(info);
		wrapper.appendChild(buttonGroup);
		menu.appendChild(wrapper);
	};

	const sortByRarity = list => list.sort((a, b) => (b.rarity || 0) - (a.rarity || 0));

	const section = (title, list, type) => {
		const titleElem = document.createElement("p");
		titleElem.textContent = title;
		menu.appendChild(titleElem);

		if (list.length === 0) {
			const empty = document.createElement("p");
			empty.textContent = `${title}を持っていません`;
			empty.style.fontSize = "0.9em";
			menu.appendChild(empty);
		} else {
			sortByRarity(list).forEach((item, index) => {
				createItemRow(item, index, type);
			});
		}
	};

	section("武器", player.inventory.weapons, "weapon");
	section("防具", player.inventory.armors, "armor");

	const close = document.createElement("button");
	close.textContent = "閉じる";
	close.classList.add("button");
	close.onclick = () => {
		menu.style.display = "none";
		bg.style.display = "none";
	};
	menu.appendChild(close);

	menu.style.display = "block";
	bg.style.display = "block";
}

function refreshStatusScreen() {
	const screen = document.getElementById("inventory-menu");
	if (screen && screen.style.display === "block") {
		toggleStatus(); // 閉じて
		toggleStatus(); // 再表示して再描画
	}
}

export function setupInventoryCloseButton() {
	const screen = document.getElementById("inventory-menu");
	const btn = screen?.querySelector("button.button");
	if (btn) {
		btn.addEventListener("click", () => {
			screen.style.display = "none";
			document.getElementById("modal-bg").style.display = "none";
		});
	}
}
