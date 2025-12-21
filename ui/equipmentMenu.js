import { updateLog } from "./log.js";
import { updateStatus } from "./status.js";
import { MAX_INVENTORY } from "../data/constants.js"; // 外部定義に切り出し推奨


function showEquipMenu() {
	const menu = document.getElementById("levelup-menu");
	const bg = document.getElementById("modal-bg");
	if (!menu || !bg) return;

	menu.innerHTML = ""; // 初期化

	const title = document.createElement("h3");
	title.textContent = `装備変更・整理（${player.inventory.weapons.length + player.inventory.armors.length} / ${MAX_INVENTORY}）`;
	menu.appendChild(title);

	// 武器セクション
	const weaponTitle = document.createElement("p");
	weaponTitle.textContent = "武器";
	menu.appendChild(weaponTitle);

	// 装備解除ボタン（武器）
	const unequipWeaponBtn = document.createElement("button");
	unequipWeaponBtn.textContent = "武器を外す";
	unequipWeaponBtn.classList.add("button");
	unequipWeaponBtn.onclick = () => {
		player.weapon = null;
		updateLog("武器を外した！");
		updateStatus();
		showEquipMenu();
	};
	menu.appendChild(unequipWeaponBtn);

	equipmentList.weapons.forEach(item => {
		const btn = document.createElement("button");
		const isEquipped = player.weapon?.name === item.name;
		btn.textContent = `${item.name}（攻撃+${item.attack}）${isEquipped ? " ✔" : ""}`;
		btn.classList.add("button");
		if (isEquipped) btn.classList.add("green");
		btn.onclick = () => {
			player.weapon = item;
			updateLog(`『${item.name}』を装備した！`);
			updateStatus();
			showEquipMenu();
		};
		menu.appendChild(btn);
	});

	// 防具セクション
	const armorTitle = document.createElement("p");
	armorTitle.textContent = "防具";
	menu.appendChild(armorTitle);

	// 装備解除ボタン（防具）
	const unequipArmorBtn = document.createElement("button");
	unequipArmorBtn.textContent = "防具を外す";
	unequipArmorBtn.classList.add("button");
	unequipArmorBtn.onclick = () => {
		player.armor = null;
		updateLog("防具を外した！");
		updateStatus();
		showEquipMenu();
	};
	menu.appendChild(unequipArmorBtn);

	equipmentList.armors.forEach(item => {
		const btn = document.createElement("button");
		const isEquipped = player.armor?.name === item.name;
		btn.textContent = `${item.name}（防御+${item.defense}）${isEquipped ? " ✔" : ""}`;
		btn.classList.add("button");
		if (isEquipped) btn.classList.add("green");
		btn.onclick = () => {
			player.armor = item;
			updateLog(`『${item.name}』を装備した！`);
			updateStatus();
			showEquipMenu();
		};
		menu.appendChild(btn);
	});

	// 閉じるボタン
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
