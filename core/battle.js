import { player } from "./player.js";
import { enemyPool } from "../data/enemies.js";
import { getLearnedSkills } from "./skill.js";
import { obtainEquipment } from "./inventory.js";
import { levelUp } from "./level.js";
import { checkQuestProgressOnKill } from "./quest.js";
import { showEnemyImage, announceEnemyAppearance, enableBattleControls } from "../ui/battleUI.js";
import { playBGM } from "./audio.js";
import { getTotalStat, resetTempBonuses, createItem, getRandomInt } from "../utils/helpers.js";
import { updateLog } from "../ui/log.js";
import { updateStatus } from "../ui/status.js";
import { skillEffects } from "../data/skillEffects.js";
import { defeatHandlers } from "./defeatHandlers.js";

// 戦闘状態の管理に関係する変数
let inBattle = false;
let currentEnemy = null;
let attackLocked = false;

export let playerTurn = true;
export function getInBattle() {
	return inBattle;
}
export function setInBattle(value) {
	inBattle = value;
}
export function getCurrentEnemy() {
	return currentEnemy;
}
export function setCurrentEnemy(enemy) {
	currentEnemy = enemy;
}

// 敵の生成・レベル補正・ドロップ処理
export function generateEnemy(level, options = {}) {
	const { forceType = null } = options;

	// 出現候補をフィルタリング
	let candidates = enemyPool.filter(e => {
		if (forceType) return e.type === forceType;
		return Math.random() < (e.spawnRate || 0);
	});

	// 候補がなければスライム
	if (candidates.length === 0) {
		candidates = enemyPool.filter(e => e.type === "slime");
	}

	// それでもいなければ仮の敵を返す
	if (candidates.length === 0) {
		console.warn("⚠️ 敵候補が見つからなかったので仮の敵を生成します");
		return {
			name: "？？？",
			baseLevel: 1,
			hp: 10,
			attack: 1,
			defense: 0,
			speed: 1,
			crit: 0,
			exp: 1,
			image: "images/slime.png", drop: null
		};
	}

	const base = structuredClone(candidates[Math.floor(Math.random() * candidates.length)]);

	// 🔧 安全な初期値を補完
	base.baseLevel ??= 1;
	base.hp ??= 10;
	base.baseAttack ??= base.attack ?? 1;
	base.baseAccuracy ??= base.accuracy ?? 100;
	base.baseCrit ??= base.crit ?? 0;
	base.baseSpeed ??= base.speed ?? 1;
	base.defense ??= 1;
	base.exp ??= 1;

	console.log("出現候補:", base.name);
	console.log("base.hp:", base.hp);
	console.log("base.baseAttack:", base.baseAttack);
	console.log("base.baseSpeed:", base.baseSpeed);
	console.log("base.baseCrit:", base.baseCrit);
	console.log("base.exp:", base.exp);

	// レベル補正
	const levelVariance = getRandomInt(-1, 2); // -1〜+2の範囲で変動
	const targetLevel = Math.max(1, level + levelVariance);
	const levelDiff = targetLevel - (base.baseLevel || 1);

	base.name = base.type === "rare" ? `${base.name}（レア）` : base.name;
	base.name += ` Lv${targetLevel}`;

	base.hp += levelDiff * 8;
	base.baseAttack += Math.floor(levelDiff * 1.45);
	base.defense += Math.floor(levelDiff * 0.98);
	base.baseSpeed = (base.baseSpeed || 1) + Math.floor(levelDiff * 0.58);
	base.baseCrit = (base.baseCrit || 0) + Math.floor(levelDiff * 0.48);
	base.baseAccuracy ??= base.accuracy ?? 100;
	base.exp = Math.floor(5 + targetLevel ** 1.1); // 例：レベルに応じて非線形に増加
	// 旧プロパティにコピー（互換性のため）
	base.attack = base.baseAttack;
	base.accuracy = base.baseAccuracy;
	base.crit = base.baseCrit;
	base.speed = base.baseSpeed;

	base.hp = Math.max(1, base.hp);
	base.baseAttack = Math.max(1, base.baseAttack);
	base.defense = Math.max(0, base.defense);

	console.log("出現候補補正後:", base.name);
	console.log("base.hp:", base.hp);
	console.log("base.baseAttack:", base.baseAttack);
	console.log("base.baseSpeed:", base.baseSpeed);
	console.log("base.baseCrit:", base.baseCrit);
	console.log("base.exp:", base.exp);

	// ドロップ抽選（1つだけ）
	base.drop = null;
	if (base.dropTable && base.dropTable.length > 0) {
		for (const entry of base.dropTable) {
			if (Math.random() < entry.chance) {
				base.drop = entry;
				break;
			}
		}
	}

	return base;
}

// 戦闘開始
export function battle(enemyTemplate) {
	currentEnemy = structuredClone(enemyTemplate); // 安全なコピー
	inBattle = true;
	playerTurn = false;

	player.potionUsedThisTurn = false; // ← 戦闘開始時にリセット（念のため）
	// 🔧 クールダウンをリセット（ここが確実！）
	player.skillCooldowns = {};

	announceEnemyAppearance(currentEnemy);
	showEnemyImage(currentEnemy.image);
	playBGM("battle");
	updateStatus();
	enableBattleControls(); // ← ここで戦闘関連のボタンを有効化！
	determineTurnOrder();
}

// プレイヤーと敵のステータスを比較してターン順を決定
export function determineTurnOrder() {
	const playerSpeed = getTotalStat(player.baseSpeed, player.speedBonus);
	const enemySpeed = currentEnemy.speed || 0;

	if (isBattleOver()) {
		endBattle(); // ← 戦闘終了処理（必要に応じて）
		return;
	}

	if (playerSpeed >= enemySpeed) {
		playerTurn = true;
		player.potionUsedThisTurn = false;
		updateLog("あなたが先手を取った！");
	} else {
		playerTurn = false;
		updateLog(`${currentEnemy.name} が先に動いた！`);
		setTimeout(() => {
			enemyAttack(currentEnemy);
			if (isBattleOver()) return; // ← ここでもチェック！
			playerTurn = true;
			player.potionUsedThisTurn = false;
			//updateLog("あなたのターン！", "info");
		}, 500);
	}
}

// プレイヤーの通常攻撃処理
export function attack() {
	if (attackLocked) return; // ← すでに押されてたら無視！
	attackLocked = true;

	const attackBtn = document.querySelector('button[data-action="attack"]');
	if (attackBtn) attackBtn.disabled = true; // ← ここで即無効化！

	if (!getInBattle() || !isPlayerTurn() || player.hp <= 0) {
		// 状況によってログを出すかどうか分ける
		if (!getInBattle()) return; // 戦闘終了後は静かに無視
		if (!isPlayerTurn()) updateLog("⚠️ まだあなたのターンじゃないよ！");
		else updateLog("⚠️ 攻撃はできない状態だよ！");
		attackLocked = false;
		return;
	}

	playerTurn = false;

	if (!currentEnemy) return;

	// ここで再チェック（安全のため）
	if (isBattleOver()) return;

	const label = "attack";

	// 命中判定（プレイヤーの命中 vs 敵のすばやさ）
	const accuracy = getTotalStat(player.baseAccuracy, player.accuracyBonus, player.weapon?.accuracy || 0);
	const enemySpeed = getTotalStat(currentEnemy.baseSpeed, currentEnemy.speedBonus);

	if (!didHit(accuracy, enemySpeed)) {
		updateLog("😵 攻撃が外れた！");
		endPlayerTurn();
		return;
	}

	// ダメージ計算
	const totalAttack = getTotalStat(player.baseAttack, player.attackBonus, player.weapon?.attack || 0);
	let baseDamage = totalAttack;
	let isCritical = false;

	const totalCritRate = getTotalStat(player.baseCrit, player.critBonus, player.weapon?.critRate || 0) / 100;

	if (Math.random() < totalCritRate) {
		const critMultiplier = player.weapon?.critMultiplier || 2;
		baseDamage *= critMultiplier;
		isCritical = true;
	}

	const enemyDefense = currentEnemy.defense || 0;
	const damage = Math.max(1, Math.floor(baseDamage - enemyDefense));

	currentEnemy.hp -= damage;

	// ログ表示
	if (isCritical) updateLog("💥 クリティカルヒット！", "info");
	updateLog(`${currentEnemy.name} に ${damage} のダメージを与えた！`, "info");

	updateStatus();

	// 撃破判定
	if (isBattleOver()) {
		handleEnemyDefeat();
	} else {
		endPlayerTurn();
	}
}

// スキル使用処理（攻撃 or 回復）
export function castSkill(id) {
	console.log("現在のクールダウン状態:", JSON.stringify(player.skillCooldowns));

	if (!inBattle) return updateLog("スキルは戦闘中にしか使えないよ！");
	if (!playerTurn) return updateLog("今は相手のターンだよ！");
	if (player.hp <= 0) return updateLog("気絶していてスキルを使えない…！");

	const skill = getLearnedSkills().find(s => s.id === id);
	if (!skill) return updateLog(`そのスキルはまだ習得していないか、使えないスキルです！`);

	// 🔒 クールダウン中かチェック
	if (player.skillCooldowns?.[id] > 0) {
		return updateLog(`${skill.name} はまだ使えない！（残り${player.skillCooldowns[id]}ターン）`, "warning");
	}

	if (player.mp < skill.mpCost) return updateLog("MPが足りない！", "warning");

	playerTurn = false;
	player.mp -= skill.mpCost;
	updateLog(`🌀 ${skill.name} を使用！（MP -${skill.mpCost}）`, "skill");

	// 🔁 クールダウンを設定
	if (skill.cooldown) {
		player.skillCooldowns[id] = skill.cooldown;
	}

	// 命中判定
	const accuracy = getTotalStat(player.baseAccuracy, player.accuracyBonus, player.weapon?.accuracy || 0);
	const enemySpeed = getTotalStat(currentEnemy.baseSpeed, currentEnemy.speedBonus);
	if (skill.canMiss && !didHit(accuracy, enemySpeed)) {
		updateLog("😵 スキルが外れた！");
		endPlayerTurn();
		return;
	}

	// スキル効果を実行
	const result = skill.effect();

	if (result?.type === "damage") {
		const damage = Math.max(1, result.value);
		currentEnemy.hp -= damage;
		updateLog(`🔥 ${skill.name}！${currentEnemy.name} に ${damage} ダメージ！`, "skill");
	} else if (result?.type === "heal") {
		player.hp = Math.min(player.maxHp, player.hp + result.value);
		updateLog(`✨ ${skill.name} でHPを${result.value}回復！`, "success");
	}

	updateStatus();

	if (isBattleOver()) {
		handleEnemyDefeat();
		return;
	}

	if (playerTurn) {
		endPlayerTurn();
	} else {
		playerTurn = true;
		player.potionUsedThisTurn = false;
		const attackBtn = document.querySelector('button[data-action="attack"]');
		if (attackBtn) attackBtn.disabled = false;
		attackLocked = false;
	}
}

// 命中率計算処理
export function didHit(accuracy, targetSpeed) {
	const evasion = (targetSpeed || 0) * 0.8;
	const hitChance = Math.min(1.00, Math.max(0.6, (accuracy - evasion) / 100));
	const roll = Math.random(); // ← 0〜1 の小数に統一！
	console.log(`命中判定: 命中率=${(hitChance * 100).toFixed(1)}% 判定値=${(roll * 100).toFixed(1)}%`);
	return roll < hitChance;
}

// 撃破後処理
export function handleEnemyDefeat() {
	checkQuestProgressOnKill(currentEnemy);

	updateLog(`${currentEnemy.name} をたおした！`, "success");
	player.exp += currentEnemy.exp;
	updateLog(`経験値 +${currentEnemy.exp}`, "success");

	if (currentEnemy.drop) {
		const roll = Math.random();
		if (roll < currentEnemy.drop.chance) {
			const drop = currentEnemy.drop;
			const newItem = createItem(drop.item);
			obtainEquipment(drop.type, newItem);
			updateLog(`${drop.type === "weapon" ? "🗡️" : "🛡️"} ${drop.item.name} を手に入れた！（未装備）`, "item");
			updateLog("📦 装備メニューから装備できます！", "info");
		}
	}

	// 🔽 defeatHandlers の呼び出しをここに追加！
	if (currentEnemy.onDefeatId && defeatHandlers[currentEnemy.onDefeatId]) {
		defeatHandlers[currentEnemy.onDefeatId]();
	}

	if (player.exp >= player.nextExp) {
		levelUp();
	}

	inBattle = false;
	currentEnemy = null;

	resetTempBonuses(player); // ← ここで一時的な補正をリセット！

	showEnemyImage(null);
	playBGM("field");
	updateStatus();
	player.skillCooldowns = {};
	attackLocked = false;
}

// 敵の攻撃処理
export function enemyAttack(enemy) {
	if (!enemy) {
		console.warn("敵が存在しません");
		return;
	}

	// 🔽 ここを追加！スキルを使うか判定
	const useSkill = enemy.skills && enemy.skills.length > 0 && Math.random() < 0.3;
	if (useSkill) {
		enemyUseSkill(enemy);
		setTimeout(() => {
			playerTurn = true;
		}, 500);
		return;
	}

	// 命中判定
	const enemyAccuracy = getTotalStat(enemy.baseAccuracy || 0, enemy.accuracyBonus || 0, enemy.weapon?.accuracy || 0);
	const playerEvasion = getTotalStat(player.baseSpeed, player.speedBonus);
	if (!didHit(enemyAccuracy, playerEvasion)) {
		updateLog(`${enemy.name} の攻撃は外れた！`, "enemy");
		//endPlayerTurn();
		endEnemyTurn(); // ← ここに変更！
		return;
	}

	// ダメージ計算
	const enemyAttackPower = getTotalStat(enemy.baseAttack || 0, enemy.attackBonus || 0, enemy.weapon?.attack || 0);
	const rawDamage = Math.floor(enemyAttackPower * (0.8 + Math.random() * 0.4)); // 80〜120%
	const totalDefense = getTotalStat(player.baseDefense, player.defenseBonus, player.armor?.defense || 0);
	const damage = Math.max(1, Math.floor(rawDamage - totalDefense));

	player.hp -= damage;

	updateLog(`${enemy.name} の攻撃！${damage} ダメージを受けた！`, "enemy");
	updateStatus();

	if (player.hp <= 0) {
		updateLog("勇者はたおれてしまった… ゲームオーバー。", "error");
		updateLog("💡『ロード』ボタンでセーブデータを読み込んで再挑戦できるよ！", "info");
		updateLog("💡または『F5キー』でゲームを最初からやり直せるよ！", "info");
		currentEnemy = null;
		inBattle = false;
		player.skillCooldowns = {}
		showEnemyImage(null);
		playBGM("field");
	} else {
		endEnemyTurn(); // ← ここも！
	}
}

// 敵がスキルを使う処理
export function enemyUseSkill(enemy) {
	if (!enemy.skills || enemy.skills.length === 0) {
		updateLog(`${enemy.name} は様子を見ている…`);
		updateStatus();
		return;
	}

	// スキルをランダム選択（確率付き）
	const usable = enemy.skills.filter(s => Math.random() < s.chance);
	const skill = usable[Math.floor(Math.random() * usable.length)];

	if (!skill || !skill.effectId) {
		enemyNormalAttack(enemy); // ← 通常攻撃にフォールバック！
		return;
	}

	const effectFn = skillEffects[skill.effectId];
	if (!effectFn) {
		console.warn(`スキル効果 '${skill.effectId}' が見つかりません`);
		updateLog(`${enemy.name} は様子を見ている…`);
		updateStatus();
		return;
	}

	const result = effectFn();

	if (result?.type === "damage") {
		const damage = Math.max(1, result.value);
		player.hp -= damage;
		updateLog(`💥 ${enemy.name} の ${skill.name}！${damage} ダメージを受けた！`, "enemy");
	} else if (result?.type === "buff" || result?.type === "debuff") {
		const statKey = `${result.stat}Bonus`;
		const bonus = player[statKey];

		if (typeof bonus !== "object" || bonus === null) {
			player[statKey] = { permanent: 0, temp: 0 };
		}

		player[statKey].temp += result.amount;

		const sign = result.amount > 0 ? "上がった" : "下がった";
		updateLog(`✨ ${enemy.name} の ${skill.name}！${result.stat} が${sign}！`, "enemy");
	}

	updateStatus();

	if (player.hp <= 0) {
		updateLog("勇者はたおれてしまった…", "error");
		inBattle = false;
		currentEnemy = null;
		showEnemyImage(null);
		playBGM("field");
	} else {
		//playerTurn = true;
	}
	endEnemyTurn();

}

// プレイヤーのターン終了処理
export function endPlayerTurn() {
	playerTurn = false;
	player.potionUsedThisTurn = false;
	reduceSkillCooldowns();
	setTimeout(() => {
		enemyAttack(currentEnemy);
		playerTurn = true;

		// 攻撃ボタンを再有効化
		const attackBtn = document.querySelector('button[data-action="attack"]');
		if (attackBtn) attackBtn.disabled = false;

		attackLocked = false; // ← ここでロック解除！
	}, 500);
}

// スキルクールダウン用
function reduceSkillCooldowns() {
	console.log("プレイヤーのターン終了-スキルクールダウン");
	for (const skillId in player.skillCooldowns) {
		if (player.skillCooldowns[skillId] > 0) {
			player.skillCooldowns[skillId]--;
		}
	}
}

// 敵のターン終了処理
function endEnemyTurn() {
	console.log("🧟‍♂️ 敵のターン開始！");

	// 🔧 クールダウンを減らす（ここを追加！）
	reduceSkillCooldowns();

	setTimeout(() => {
		if (isBattleOver()) return;

		playerTurn = true;
		player.potionUsedThisTurn = false;
		disableBattleControls(); // 一旦すべて無効化

		updateStatus();

		// 少し待ってからボタンを有効化（演出のため）
		setTimeout(() => {
			if (isBattleOver()) return;
			if (!playerTurn) return; // ← ここを追加！
			const attackBtn = document.querySelector('button[data-action="attack"]');
			if (attackBtn) attackBtn.disabled = false;
		}, 300);
	}, 500);
}

// 通常攻撃
function enemyNormalAttack(enemy) {
	const enemyAccuracy = getTotalStat(enemy.baseAccuracy || 0, enemy.accuracyBonus || 0, enemy.weapon?.accuracy || 0);
	const playerEvasion = getTotalStat(player.baseSpeed, player.speedBonus);

	if (!didHit(enemyAccuracy, playerEvasion)) {
		updateLog(`${enemy.name} の攻撃は外れた！`, "enemy");
		updateStatus();
		endEnemyTurn();
		return;
	}

	const enemyAttackPower = getTotalStat(enemy.baseAttack || 0, enemy.attackBonus || 0, enemy.weapon?.attack || 0);
	const rawDamage = Math.floor(enemyAttackPower * (0.8 + Math.random() * 0.4));
	const totalDefense = getTotalStat(player.baseDefense, player.defenseBonus, player.armor?.defense || 0);
	const damage = Math.max(1, Math.floor(rawDamage - totalDefense));

	player.hp -= damage;
	updateLog(`${enemy.name} の攻撃！${damage} ダメージを受けた！`, "enemy");
	updateStatus();

	if (player.hp <= 0) {
		updateLog("勇者はたおれてしまった…", "error");
		inBattle = false;
		currentEnemy = null;
		showEnemyImage(null);
		playBGM("field");
	} else {
		endEnemyTurn();
	}
}

// 終了チェック
export function isBattleOver() {
	return !inBattle || !currentEnemy || currentEnemy.hp <= 0 || player.hp <= 0;
}

// 攻撃ボタンを無効化
function disableBattleControls() {
	const attackBtn = document.getElementById("attack-button");
	if (attackBtn) attackBtn.disabled = true;

	const skillBtns = document.querySelectorAll(".skill-button");
	skillBtns.forEach(btn => btn.disabled = true);
}

export function isPlayerTurn() {
	return playerTurn;
}
export function isAttackLocked() {
	return attackLocked;
}
export function setAttackLocked(value) {
	attackLocked = value;
}
