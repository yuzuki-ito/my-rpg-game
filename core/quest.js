import { updateLog } from "../ui/log.js";
import { renderQuestList } from "../ui/questLog.js";
import { questList } from "../data/quests.js";
import { player } from "./player.js";
import { updateStatus } from "../ui/status.js";
import { addItemToInventory, obtainEquipment } from "./inventory.js";
import { showDialogue } from "../ui/dialog.js";
import { villagers } from "../data/villagers.js";
import { learnSkill } from "./skill.js";
import { createItem } from "../utils/helpers.js"; // すでにインポートされていればOK
import { levelUp } from "./level.js";

// プレイヤーのクエスト状態を初期化（セーブデータに基づいて補完）
export function initializeQuests() {
	player.quests = player.quests || {};
	for (const key in questList) {
		if (!player.quests[key]) {
			player.quests[key] = {
				started: false,
				completed: false,
				progress: 0
			};
		}
	}
}

// クエスト開始
export function startQuest(key) {
	console.log("startQuest 呼び出し:", key);
	const def = questList[key];
	if (!def) {
		updateLog("⚠️ クエストが存在しません！", "warning");
		return;
	}

	// 前提クエストの確認
	if (def.prerequisite && !player.quests[def.prerequisite]?.completed) {
		updateLog("⚠️ このクエストはまだ受けられません！", "warning");
		return;
	}

	const quest = player.quests[key];

	if (quest?.started) {
		updateLog("⚠️ すでに開始済みのクエストです！", "warning");
		return;
	}

	// 初受注（または未開始）
	player.quests[key] = {
		started: true,
		completed: quest?.completed || false,
		progress: quest?.progress || 0
	};

	updateLog(`🆕 クエスト開始！『${def.title}』`, "quest");
	if (def.description) {
		updateLog(`📖 ${def.description}`, "quest");
	}

	renderQuestList();
}

// クエスト完了処理
export function completeQuest(key, logBuffer = null) {

	console.log("completeQuest");

	const quest = player.quests[key];
	const def = questList[key];
	if (!quest || !def || !quest.started || quest.completed) return;

	quest.completed = true;
	quest.started = false;

	const buffer = logBuffer || [];

	buffer.push({ text: `🎉 クエスト『${def.title}』達成！`, type: "quest" });

	// 報酬処理
	if (typeof def.reward === "function") {
		def.reward(buffer);
	} else if (typeof def.reward === "object") {
		grantQuestReward(def, buffer);
	}

	if (!logBuffer) {
		buffer.forEach(entry => {
			if (typeof entry === "string") {
				updateLog(entry);
			} else {
				updateLog(entry.text, entry.type);
			}
		});
	}

	renderQuestList();
	updateStatus();
}

// 報酬処理を共通化
export function grantQuestReward(quest, logBuffer = []) {

	console.log("grantQuestReward");

	const reward = quest.reward;
	if (!reward) return;

	if (reward.exp) {
		player.exp += reward.exp;
		logBuffer.push({ text: `📘 経験値 +${reward.exp}`, type: "info" });
		while (player.exp >= player.nextExp) {
			levelUp(logBuffer); // レベルアップもバッファ対応に
		}
	}
	if (reward.gold) {
		player.gold = (player.gold || 0) + reward.gold;
		logBuffer.push({ text: `💰 ゴールド +${reward.gold}`, type: "info" });
	}
	if (reward.potions) {
		player.potions = (player.potions || 0) + reward.potions;
		logBuffer.push({ text: `🧪 ポーション ×${reward.potions}`, type: "info" });

	}
	if (reward.maxHp) {
		player.maxHp += reward.maxHp;
		logBuffer.push({ text: `💪 最大HP +${reward.maxHp}`, type: "info" });

	}
	if (reward.items) {
		reward.items.forEach(item => {
			const newItem = createItem(item);
			if (item.type === "weapon" || item.type === "armor") {
				obtainEquipment(item.type, newItem);
				logBuffer.push({ text: `${item.type === "weapon" ? "🗡️" : "🛡️"} ${item.name} を手に入れた！（未装備）`, type: "info" });

			} else {
				addItemToInventory(newItem);
				logBuffer.push({ text: `🎁 ${item.name} ×${item.quantity || 1} を手に入れた！`, type: "info" });
			}
		});
	}
	if (reward.skill) {
		const skills = Array.isArray(reward.skill) ? reward.skill : [reward.skill];
		skills.forEach(id => {
			const skill = learnSkill(id);
			if (skill) {
				logBuffer.push({ text: `📘 スキル『${skill.name}』を習得した！`, type: "info" });
			}
		});
	}

	updateStatus();
}

// クエスト進行度チェック
export function updateQuestProgress(key, amount = 1) {

	console.log("updateQuestProgress");

	const quest = player.quests[key];
	const def = questList[key];
	if (!quest || !def || quest.completed) return;

	// すでに目標に達しているなら何もしない
	if (quest.progress >= def.goal) return;

	// 進行度を加算（上限を超えないように）
	quest.progress = Math.min(quest.progress + amount, def.goal);

	// 達成した瞬間だけログを出す
	if (quest.progress >= def.goal) {
		updateLog(`クエスト『${def.title}』の目標を達成した！報告しよう！`, "quest");
		if (def.autoComplete) {
			completeQuest(key);
		}
	} else {
		updateLog(`📘『${def.title}』進行度：${quest.progress}/${def.goal}`, "quest");
	}
}

// クエスト完了処理
export function checkQuestProgressOnKill(enemy) {

	console.log("checkQuestProgressOnKill");

	for (const key in player.quests) {
		const quest = player.quests[key];
		const def = questList[key];
		if (!quest || !def || quest.completed || !quest.started) continue;

		if (def.type === "kill" && enemy.type === def.target) {
			updateQuestProgress(key);
		}
	}
}

// 汎用的な会話関数
export function talkToVillagerById(id) {
	console.log(`talkToVillagerById`);
	const villager = villagers[id];
	if (!villager) return;

	const quest = player.quests[villager.questKey];
	const def = questList[villager.questKey];

	if (!quest || !def) {
		updateLog(`${villager.name}：『こんにちは！』`);
		return;
	}

	if (quest.completed) {
		updateLog(`${villager.name}：『${villager.dialogue.completed}』`);
		return;
	}

	if (!quest.started) {
		showDialogue(`${villager.name}：『${villager.dialogue.intro}』`, ["引き受ける", "断る"], (choice) => {
			if (choice === "引き受ける") {
				startQuest(villager.questKey);
			} else {
				updateLog(`${villager.name}：『そうか…残念だ』`);
			}
		});
		return;
	}

	if (quest.progress >= def.goal && def.autoComplete === false) {
		completeQuest(villager.questKey);
		updateLog(`${villager.name}：『${villager.dialogue.thanks}』`);
		return;
	}

	updateLog(`${villager.name}：『${typeof villager.dialogue.inProgress === "function"
		? villager.dialogue.inProgress(quest)
		: villager.dialogue.inProgress}』`);
}

// 草むら系クエスト共通化
export function handleGatheringTile(
	questKey,
	successRate = 0.6,
	foundMessage = "何かを見つけた！",
	failMessage = "何も見つからなかった…"
) {
	console.log("handleGatheringTile");

	const quest = player.quests[questKey];
	const def = questList[questKey];

	if (!quest || !def || !quest.started || quest.completed || quest.progress >= def.goal) {
		updateLog("ここには何もなさそうだ…", "info");
		return;
	}

	// 🔒 連続採集制限：同じマスでの採集を防ぐ
	const currentPos = `${player.location.x},${player.location.y}`;
	if (player.lastGatherPosition === currentPos) {
		updateLog("⚠️ 同じ場所ではもう何も見つからなさそうだ…", "info");
		return;
	}
	player.lastGatherPosition = currentPos;

	// 成功判定
	if (Math.random() < successRate) {
		quest.progress = Math.min(quest.progress + 1, def.goal);
		updateLog(`🌿 ${foundMessage}`, "quest");
		updateLog(`（${def.title} ${quest.progress} / ${def.goal}）`, "quest");

		if (quest.progress >= def.goal) {
			if (def.autoComplete) {
				completeQuest(questKey);
			} else {
				updateLog(`クエスト『${def.title}』の目標を達成した！報告しよう！`, "quest");
			}
		}
	} else {
		updateLog(failMessage);
	}
}

export function isQuestActive(key) {
	const q = player.quests[key];
	return q?.started && !q.completed;
}

export function isQuestCompleted(key) {
	return player.quests[key]?.completed;
}

// 現在位置にいる村人だけを対象にする
export function getVillagerAt(mapId, x, y) {
	console.log("全村人リスト:", villagers);
	Object.values(villagers).forEach(v => {
		console.log(`${v.name} の位置:`, v.location);
	});
	return Object.values(villagers).find(v =>
		v.location.mapId === mapId &&
		v.location.x === x &&
		v.location.y === y
	);
}
