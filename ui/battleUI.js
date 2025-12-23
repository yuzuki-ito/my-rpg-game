import { updateLog } from "./log.js";
import { getCurrentEnemy, attack, getInBattle, playerTurn, isPlayerTurn } from "../core/battle.js";
import { usePotion, rest } from "../core/items.js";
import { openSkillMenu } from "./skillMenu.js";

// battleUI.js の先頭に追加
let attackLocked = false;

// ボタン操作
export function setupBattleActionButtons() {
	const buttons = document.querySelectorAll("button[data-action]");
	buttons.forEach(btn => {
		btn.addEventListener("click", () => {
			const action = btn.getAttribute("data-action");

			switch (action) {
				case "attack":
					if (getInBattle() && isPlayerTurn()) {
						if (attackLocked) return; // ← 念のためここでも！
						btn.disabled = true; // ← 連打防止！
						attack();
					} else {
						updateLog("⚠️ 攻撃は戦闘中しかできないよ！");
					}
					break;

				case "skill":
					openSkillMenu(); // ← 常時OK（内部でMPやスキル有無をチェック）
					break;

				case "potion":
					usePotion(); // ← 常時OK（内部で条件チェック済み）
					break;

				case "rest":
					rest(); // ← 探索中のみ有効（内部で制御済み）
					break;
			}
		});
	});
}

// ====== 敵の出現演出（ログ表示） ======
export function announceEnemyAppearance(enemy) {
	if (!enemy || typeof enemy.name !== "string") return;

	if (enemy.name.includes("レア") || enemy.rarity === "rare") {
		updateLog(`✨✨ ${enemy.name} が現れた！✨✨`, "quest");
	} else if (enemy.rarity === "legendary") {
		updateLog(`🌟🌟 ${enemy.name} が降臨した！🌟🌟`, "enemy");
	} else if (enemy.rarity === "boss") {
		updateLog(`👹 ボス『 ${enemy.name}』が現れた！`, "enemy");
	} else {
		updateLog(`⚔️ ${enemy.name} が現れた！`, "enemy");
	}
}

// ====== 敵画像の表示・演出 ======
export function showEnemyImage(src, targetId = "enemy-img") {
	const img = document.getElementById(targetId);
	if (!img) return;

	if (src) {
		img.src = src;
		img.style.display = "block";

		// レアリティに応じた演出クラスの付け替え
		img.classList.remove("rare-glow", "legendary-glow");

		if (getCurrentEnemy()?.rarity === "legendary") {
			img.classList.add("legendary-glow");
		} else if (getCurrentEnemy()?.rarity === "rare") {
			img.classList.add("rare-glow");
		}
	} else {
		img.style.display = "none";
		img.classList.remove("rare-glow", "legendary-glow");
	}
}

// 戦闘関連-ボタン有効化関数
export function enableBattleControls() {
	const attackBtn = document.querySelector('button[data-action="attack"]');
	if (attackBtn) attackBtn.disabled = false;

	const skillBtn = document.querySelector('button[data-action="skill"]');
	if (skillBtn) skillBtn.disabled = false;

	const potionBtn = document.querySelector('button[data-action="potion"]');
	if (potionBtn) potionBtn.disabled = false;
}
