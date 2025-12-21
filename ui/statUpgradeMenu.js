import { updateLog } from "./log.js";
import { updateStatus } from "./status.js";
import { player } from "../core/player.js";

// ステータス強化画面
export function showStatUpgradeMenu() {
	const menu = document.getElementById("stat-upgrade");
	const bg = document.getElementById("modal-bg");
	if (!menu || !bg) return;

	menu.innerHTML = "";

	const header = document.createElement("h3");
	header.textContent = `📈 ステータス強化（残りSP: ${player.skills.points}）`;
	menu.appendChild(header);

	const upgrades = [
		{ label: "最大HP +5", apply: () => player.maxHp += 5 },
		{ label: "最大MP +3", apply: () => player.maxMp += 3 },
		{ label: "攻撃力 +1", apply: () => player.attackBonus += 1 },
		{ label: "防御力 +1", apply: () => player.defenseBonus += 1 },
		{ label: "すばやさ +1", apply: () => player.speedBonus += 1 },
		{ label: "会心率 +1%", apply: () => player.critBonus += 1 },
		{ label: "命中率 +1%", apply: () => player.accuracyBonus += 1 },
		{ label: "回復力 +1", apply: () => player.recoveryBonus += 1 },
		{ label: "魔力 +1", apply: () => player.magicBonus += 1 }
	];

	// ステータス強化ボタンをまとめるコンテナ
	const optionContainer = document.createElement("div");
	optionContainer.id = "stat-options";

	upgrades.forEach(upg => {
		const btn = document.createElement("button");
		btn.textContent = upg.label;
		btn.classList.add("button");

		if (player.skills.points > 0) {
			btn.onclick = () => {
				upg.apply();
				player.skills.points--;
				updateLog(`🔧 ${upg.label} を強化した！`);
				updateStatus();
				showStatUpgradeMenu(); // 再描画
			};
		} else {
			btn.disabled = true;
			btn.classList.add("unavailable");
		}

		optionContainer.appendChild(btn);
	});

	menu.appendChild(optionContainer);

	// 閉じるボタン
	const close = document.createElement("button");
	close.textContent = "閉じる";
	close.classList.add("button", "close-button");
	close.onclick = () => {
		menu.style.display = "none";
		bg.style.display = "none";
	};

	// フッター要素を作ってボタンを包む
	const footer = document.createElement("div");
	footer.classList.add("modal-footer");
	footer.appendChild(close);

	// メニューに追加
	menu.appendChild(footer);

	menu.style.display = "block";
	bg.style.display = "block";
}
