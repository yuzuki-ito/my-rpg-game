// ====== Imports ======
import { mapData, mapSize } from "../data/mapData.js";
import { mapMeta } from "../data/mapMeta.js";
import { TILE_INFO } from "../data/tileTypes.js";
import { villagers } from "../data/villagers.js";
import { talkToVillagerById, handleGatheringTile, getVillagerAt, startQuest, completeQuest } from "./quest.js";
import { updateLog } from "../ui/log.js";
import { updateStatus } from "../ui/status.js";
import { playBGM } from "./audio.js";
import { generateEnemy, battle, getInBattle } from "./battle.js";
import { findItem } from "./items.js";
import { questList } from "../data/quests.js";
import { player } from "./player.js";
import { showDialogue } from "../ui/dialog.js";
import { defeatHandlers } from "./defeatHandlers.js";
import { enemyPool } from "../data/enemies.js"; // ← これが必要！

// ====== マップ描画処理 マルチマップ対応======
export function drawMap() {
	const map = document.getElementById("map");
	if (!map) {
		console.warn("#map が見つからないよ！");
		return;
	}
	console.log("現在のマップID:", player.location.mapId);
	console.log("mapData:", mapData);
	console.log("現在のマップ:", mapData[player.location.mapId]);

	const currentMap = mapData[player.location.mapId];
	if (!currentMap) {
		console.warn(`マップ '${player.location.mapId}' が存在しません！`);
		return;
	}

	let output = "";
	for (let y = 0; y < currentMap.length; y++) {
		for (let x = 0; x < currentMap[y].length; x++) {
			if (player.location.x === x && player.location.y === y) {
				output += "🧍";
				continue;
			}

			const villagerHere = Object.values(villagers).find(v =>
				v.location.mapId === player.location.mapId &&
				v.location.x === x &&
				v.location.y === y
			);

			if (villagerHere) {
				output += villagerHere.icon || "👤"; // ← 村人ごとのアイコンを使用！
			} else {
				output += currentMap[y][x];
			}
		}
		output += "\n";
	}
	map.textContent = output;
}

// ====== プレイヤーの移動とマスのイベント処理 ======
export function move(dir) {
	if (player.hp <= 0 || getInBattle()) return;

	const currentMap = mapData[player.location.mapId];
	const height = currentMap.length;
	const width = currentMap[0].length;

	// 移動処理
	if (dir === "up" && player.location.y > 0) player.location.y--;
	if (dir === "down" && player.location.y < height - 1) player.location.y++;
	if (dir === "left" && player.location.x > 0) player.location.x--;
	if (dir === "right" && player.location.x < width - 1) player.location.x++;

	drawMap();

	// 行動フラグリセット
	player.hasActedThisTurn = false;
	player.potionUsedThisTurn = false;
	player.actionTakenThisStep = false;
	player.lastGatherPosition = null;
	player.potionUsedThisStep = false;
	player.restedThisStep = false;

	// 現在のマスのイベント処理
	const tile = currentMap[player.location.y][player.location.x];
	const tileInfo = TILE_INFO[tile];

	if (tileInfo?.handler) {
		tileInfo.handler(player);
	} else {
		handleRandomTile();
	}
}

// 移動時に何も起こらなかった時の処理
function handleRandomTile() {
	const meta = mapMeta[player.location.mapId];
	const chance = Math.random();

	if (chance < meta.encounterRate) {
		const enemy = generateEnemy(player.level);
		battle(enemy);
	} else if (chance < 0.3) {
		findItem();
	} else {
		updateLog("辺りは静かだ…");
	}
}

// ====== イベント処理 ======
export function handleVillageTile(player) {
	console.log("現在位置:", player.location.mapId, player.location.x, player.location.y);
	const villager = getVillagerAt(player.location.mapId, player.location.x, player.location.y);
	console.log("見つかった村人:", villager);

	if (!villager) {
		updateLog("誰もいないようだ。");
		return;
	}

	const questKey = villager.questKey;
	const questDef = questList[questKey];
	const questState = player.quests[questKey];
	const prereq = questDef?.prerequisite;
	const prereqMet = !prereq || player.quests[prereq]?.completed;
	const introText = typeof villager.dialogue.intro === "function" ? villager.dialogue.intro(questDef) : villager.dialogue.intro;

	console.log("クエスト:", questKey);
	console.log("状態:", questState);
	console.log("前提条件:", prereq, "→ 達成済み？", prereqMet);

	if (!questDef) {
		updateLog(`${villager.name}：「こんにちは。」`);
		return;
	}

	console.log(player.quests.slimeHunt);

	if ((!questState || (!questState.started && !questState.completed)) && prereqMet) {
		showDialogue(
			`${villager.name}：「${introText}」`,
			["引き受ける", "断る"],
			(choice) => {
				if (choice === "引き受ける") {
					startQuest(questKey);
				} else {
					updateLog(`${villager.name}：「そうかい…残念じゃ。」`);
				}
			}
		);
		return;
	}
	else if (!questState) {
		updateLog(`${villager.name}：「今はまだ頼めないことがあるんじゃ…」`);
	} else if (!questState.completed) {
		if (questState.progress >= questDef.goal) {
			completeQuest(questKey);
			updateLog(`${villager.name}：「${villager.dialogue.completed}」`);
			if (villager.dialogue.thanks) {
				updateLog(`${villager.name}：「${villager.dialogue.thanks}」`);
			}
		} else {
			const msg = typeof villager.dialogue.inProgress === "function"
				? villager.dialogue.inProgress(questState)
				: villager.dialogue.inProgress;
			updateLog(`${villager.name}：「${msg}」`);
		}
	}
	else {
		// 完了報酬などがあるならここで処理
		completeQuest(questKey); // ← ここで正式に完了処理！
		updateLog(`${villager.name}：「${villager.dialogue.completed}」`);
	}

	// 回復処理（必要なら）
	if (player.hp < player.maxHp) {
		player.hp = player.maxHp;
		player.mp = player.maxMp;
		updateLog("村で休んでHPとMPが全回復した！");
		updateStatus();
	}

	playBGM(mapMeta[player.location.mapId]?.bgm || "field");
}

// 薬草クエストの処理
export function handleGrassTileEvent(player) {
	updateLog("草むらに入った…");

	console.log("草むらクエスト実行");

	const herbQuest = player.quests.herbGathering;
	const herbDef = questList.herbGathering;
	const roll = Math.random();

	if (herbQuest && herbDef && !herbQuest.completed && herbQuest.progress < herbDef.goal && roll < 0.5) {
		handleGatheringTile("herbGathering", 0.5, "薬草を見つけた！", "草むらを探したが、何も見つからなかった…");
	} else if (roll < 0.5) {
		const enemy = generateEnemy(player.level, { forceType: "goblin" });
		updateLog("🌿 草むらからゴブリンが飛び出してきた！");
		battle(enemy);
	} else {
		updateLog("🌿 風がそよそよ…何も見つからなかった。");
	}
}

// ボスのクエスト処理
export function handleBossTile(player) {
	const quest = player.quests?.bossBattle;
	const hasStarted = quest?.started === true;
	const isCompleted = quest?.completed === true;
	let statuchangebossflg = false; // ボスのステータス変更用

	console.log("クエスト:", quest);
	console.log("開始？:", hasStarted);
	console.log("完了？:", isCompleted);

	let boss;

	if (!hasStarted && !isCompleted) {
		updateLog("⚠️ クエストを受けていないため、討伐しても報酬は得られない…", "warning");
		boss = findEnemyById("feralDragon");
		boss.exp = Math.floor(boss.exp * 0.1);
		boss.name = "狂暴なドラゴン";
		boss.hp = Math.floor(boss.hp * 10);
		boss.attack = Math.floor(boss.attack * 10);
		boss.defense = Math.floor(boss.defense * 10);
		boss.critRate = 1.0;
		boss.critMultiplier = 3;
		boss.tags = [...(boss.tags || []), "berserk"];
		boss.onDefeatId = "feralDragonDefeat";
		// updateLog("🔥 狂気に満ちたドラゴンが襲いかかってきた！", "danger");

	} else if (isCompleted) {
		updateLog("💀 ドラゴンが再び現れた…だが報酬はもうない。", "warning");
		boss = findEnemyById("awakenedDragon");
		boss.exp = Math.floor(boss.exp * 0.1);
		boss.name = "覚醒したドラゴン";
		boss.hp = Math.floor(boss.hp * 1.5);
		boss.attack = Math.floor(boss.attack * 1.5);
		boss.defense = Math.floor(boss.defense * 1.5);
		boss.critRate = 0.5;
		boss.critMultiplier = 3;
		boss.tags = [...(boss.tags || []), "berserk"];
		boss.onDefeatId = "awakenedDragonDefeat";
		// updateLog("🔥 覚醒したドラゴンが襲いかかってきた！", "danger");

	} else {
		// updateLog("👹 ボス『ドラゴン』が現れた！");
		boss = findEnemyById("dragon");
	}

	battle(boss, {
		onDefeat: () => {
			// クエスト進行
			if (!quest.completed) {
				quest.progress = 1;
				if (questList.bossBattle.autoComplete) {
					completeQuest("bossBattle");
				}
			}

			// 特別な defeatHandler があれば呼び出す
			if (boss.onDefeatId && defeatHandlers[boss.onDefeatId]) {
				defeatHandlers[boss.onDefeatId]();
			}
		}
	});
}

function findEnemyById(id) {
	return structuredClone(enemyPool.find(e => e.id === id));
}