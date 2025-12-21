// ====== Imports ======
import { mapData, mapSize } from "../data/mapData.js";
import { mapMeta } from "../data/mapMeta.js";
import { TILE_INFO } from "../data/tileTypes.js";
import { villagers } from "../data/villagers.js";
import { talkToVillagerById, handleGatheringTile } from "./quest.js";
import { updateLog } from "../ui/log.js";
import { updateStatus } from "../ui/status.js";
import { playBGM } from "./audio.js";
import { generateEnemy, battle, getInBattle } from "./battle.js";
import { findItem } from "./items.js";
import { questList } from "../data/quests.js";
import { player } from "./player.js";

// ====== マップ描画処理 マルチマップ対応======
export function drawMap() {
	const map = document.getElementById("map");
	if (!map) {
		console.warn("#map が見つからないよ！");
		return;
	}

	const currentMap = mapData[player.location.mapId];
	if (!currentMap) {
		console.warn(`マップ '${player.location.mapId}' が存在しません！`);
		return;
	}

	let output = "";
	for (let y = 0; y < currentMap.length; y++) {
		for (let x = 0; x < currentMap[y].length; x++) {
			output += (player.location.x === x && player.location.y === y) ? "🧍" : currentMap[y][x];
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
	} else if (chance < 0.4) {
		findItem();
	} else {
		updateLog("辺りは静かだ…");
	}
}

// ====== イベント処理 ======
export function handleVillageTile() {
	let targetVillager = null;

	for (const id in villagers) {
		const villager = villagers[id];
		const questKey = villager.questKey;
		const questDef = questList[questKey];
		const questState = player.quests[questKey];

		if (!questDef) continue;

		const prereq = questDef.prerequisite;
		const prereqMet = !prereq || player.quests[prereq]?.completed;

		// ✅ 未受注 or 進行中で、前提条件を満たしているクエストを対象にする
		if ((!questState || !questState.completed) && prereqMet) {
			targetVillager = id;
			break;
		}
	}

	if (!targetVillager) {
		updateLog("村には今、受けられるクエストがないようだ。");
	} else {
		talkToVillagerById(targetVillager);
	}

	if (player.hp < player.maxHp) {
		player.hp = player.maxHp;
		player.mp = player.maxMp;
		updateLog("村で休んでHPとMPが全回復した！");
		updateStatus();
	}
	playBGM(mapMeta.bgm || "field");
}

export function handleGrassTileEvent() {
	updateLog("草むらに入った…");

	const herbQuest = player.quests.herbGathering;
	const herbDef = questList.herbGathering;
	const roll = Math.random();

	if (herbQuest && herbDef && !herbQuest.completed && herbQuest.progress < herbDef.goal && roll < 0.7) {
		handleGatheringTile("herbGathering", 0.7, "薬草を見つけた！", "草むらを探したが、何も見つからなかった…");
	} else if (roll < 0.3) {
		const enemy = generateEnemy(player.level, { forceType: "goblin" });
		updateLog("🌿 草むらからゴブリンが飛び出してきた！");
		battle(enemy);
	} else {
		updateLog("🌿 風がそよそよ…何も見つからなかった。");
	}
}

export function handleBossTile(player) {
	const quest = player.quests?.bossBattle;

	if (!quest || !quest.started) {
		updateLog("⚠️ 今はここに立ち入るべきではない気がする…");
		return;
	}

	updateLog("👹 ボス『ドラゴン』が現れた！");
	const boss = generateEnemy(player.level, { forceType: "boss" });

	battle(boss, {
		onDefeat: () => {
			if (!quest.completed) {
				quest.progress = 1;
				if (questList.bossBattle.autoComplete) {
					completeQuest("bossBattle");
				}
			}
		}
	});
}


