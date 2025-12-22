import { player } from "../core/player.js";
import { getTotalStat } from "../utils/helpers.js";

// ステータスバーの描画・更新
export function updateStatus() {
	const status = document.getElementById("status");
	if (!status) return;

	const hpPercent = Math.floor((player.hp / player.maxHp) * 100);
	const mpPercent = Math.floor((player.mp / player.maxMp) * 100);
	//const magic = getTotalStat(player.baseMagic, player.magicBonus, player.weapon?.magic || 0);

	status.innerHTML =
		`
    <strong>${player.name}</strong>　Lv.${player.level}<br>
    HP: ${player.hp} / ${player.maxHp}
    <div class="hp-bar"><div class="hp-fill" style="width:${hpPercent}%"></div></div>
    MP: ${player.mp} / ${player.maxMp}
    <div class="mp-bar"><div class="mp-fill" style="width:${mpPercent}%"></div></div>
    EXP: ${player.exp} / ${player.nextExp}<br>
    ポーション: ${player.potions}　SP: ${player.skills.points}<br>
    武器: ${player.weapon ? player.weapon.name : "なし"}<br>
    防具: ${player.armor ? player.armor.name : "なし"}<br>
    `;

	const hpFill = document.querySelector(".hp-fill");
	if (hpFill) {
		hpFill.classList.toggle("low", hpPercent < 30);
	}

}

// ステータス画面の表示と補助関数
export function toggleStatus() {
	const screen = document.getElementById("status-screen");
	const bg = document.getElementById("modal-bg");
	const isOpen = screen.style.display === "block";

	if (isOpen) {
		screen.style.display = "none";
		bg.style.display = "none";
		return;
	}

	const stats = [
		{ key: "attack", label: "攻撃力" },
		{ key: "defense", label: "防御力" },
		{ key: "speed", label: "すばやさ" },
		{ key: "crit", label: "会心率", suffix: "%" },
		{ key: "accuracy", label: "命中率", suffix: "%" },
		{ key: "recovery", label: "回復力" },
		{ key: "magic", label: "魔力" } // ← 追加！
	];

	let html = `<h3>📊 ステータス詳細</h3>`;

	stats.forEach(stat => {
		const baseKey = `base${capitalize(stat.key)}`;
		const bonusKey = `${stat.key}Bonus`;

		const base = player[baseKey] || 0;
		const bonus = player[bonusKey] || 0;
		const equip = getEquipmentBonus(stat.key);
		const total = getTotalStat(base, bonus, equip);
		const suffix = stat.suffix || "";

		html += `<p>${stat.label}：${total}${suffix}（基本:${base} + 補正:${bonus} + 装備:${equip}）</p>`;
	});

	html += `
        <hr>
        <p>武器：${player.weapon ? player.weapon.name : "なし"}</p>
        <p>防具：${player.armor ? player.armor.name : "なし"}</p>
		<button class="button" onclick="toggleStatus()">閉じる</button>
    `;

	screen.innerHTML = html;
	screen.style.display = "block";
	bg.style.display = "block";

	// 閉じるボタンにイベントを設定
	const closeBtn = screen.querySelector("button.button");
	if (closeBtn) {
		closeBtn.addEventListener("click", toggleStatus);
	}
}

// 新しいステータスを追加しても修正不要
export function getEquipmentBonus(key) {
	let value = 0;
	if (player.weapon && player.weapon[key]) value += player.weapon[key];
	if (player.armor && player.armor[key]) value += player.armor[key];
	return value;
}

export function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function setupStatusCloseButton() {
	const screen = document.getElementById("status-screen");
	const btn = screen?.querySelector("button.button");
	if (btn) {
		btn.addEventListener("click", toggleStatus);
	}
}
