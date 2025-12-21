import { updateLog } from "../ui/log.js";
import { updateStatus } from "../ui/status.js";
import { endPlayerTurn } from "./battle.js";
import { player } from "./player.js";
import { getInBattle, playerTurn } from "./battle.js";

// 回復量定数
const POTION_HEAL = 20;
const REST_HP_BASE = 5;
const REST_MP_BASE = 2;

/**
 * ポーションを発見するイベント
 */
export function findItem() {
	player.potions++;
	updateLog("🧪 ポーションを見つけた！", "item");
	updateStatus();
}

/**
 * ポーションを使用してHPを回復する
 */
export function usePotion() {
	if (player.potions <= 0) {
		updateLog("❌ ポーションがない！", "warning");
		return;
	}
	if (player.hp >= player.maxHp) {
		updateLog("💡 HPはすでに満タンだ！", "info");
		return;
	}

	if (getInBattle()) {
		if (!playerTurn) {
			updateLog("⏳ 今は相手のターンだよ！", "warning");
			return;
		}
		if (player.potionUsedThisTurn) {
			updateLog("💧 このターンはもうポーションを使ったよ！", "warning");
			return;
		}
		player.potionUsedThisTurn = true;
	} else {
		if (player.potionUsedThisStep) {
			updateLog("💧 このマスではもうポーションを使ったよ！", "warning");
			return;
		}
		player.potionUsedThisStep = true;
	}

	player.potions--;
	const healed = applyHealing(POTION_HEAL);
	updateLog(`🧪 ポーションでHPを${healed}回復した！`, "item");
	updateStatus();

	if (getInBattle()) {
		endPlayerTurn();
	}
}

/**
 * 探索中に休憩してHP/MPを回復する
 */
export function rest() {
	if (getInBattle()) {
		updateLog("⚔️ 戦闘中は休めない！", "warning");
		return;
	}
	if (player.restedThisStep) {
		updateLog("💤 このマスではもう休めないよ！", "warning");
		return;
	}

	// 🛑 HP・MPが両方満タンなら休めない
	if (player.hp >= player.maxHp && player.mp >= player.maxMp) {
		updateLog("💡 HPもMPも満タンだよ。今は休む必要はなさそうだ。", "info");
		return;
	}

	const hpHeal = REST_HP_BASE + (player.recovery || 0);
	const mpHeal = REST_MP_BASE + Math.floor((player.recovery || 0) / 2);

	const actualHp = applyHealing(hpHeal);
	const actualMp = applyMana(mpHeal);

	player.restedThisStep = true;

	updateLog(`🌿 少し休んでHPを${actualHp}、MPを${actualMp}回復した`, "item");
	updateStatus();
}

// 共通：HP回復処理
function applyHealing(amount) {
	const before = player.hp;
	player.hp = Math.min(player.maxHp, player.hp + amount);
	return player.hp - before;
}

// 共通：MP回復処理
function applyMana(amount) {
	const before = player.mp;
	player.mp = Math.min(player.maxMp, player.mp + amount);
	return player.mp - before;
}
