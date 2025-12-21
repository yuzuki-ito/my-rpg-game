import { updateLog } from "../ui/log.js";
import { renderQuestList } from "../ui/questLog.js";
import { questList } from "../data/quests.js";
import { player } from "./player.js";
import { updateStatus } from "../ui/status.js";
import { addItemToInventory } from "./inventory.js";
import { showDialogue } from "../ui/dialog.js";
import { villagers } from "../data/villagers.js";
import { learnSkill } from "./skill.js";

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

export function startQuest(key) {
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

	if (!quest || quest.started === undefined) {
		// 初受注（新規 or started未定義）
		player.quests[key] = {
			started: true,
			completed: quest?.completed || false,
			progress: quest?.progress || 0
		};
		updateLog(`🆕 クエスト開始！『${def.title}』`, "quest");
		if (def.description) {
			updateLog(`📖 ${def.description}`);
		}
	} else if (!quest.started) {
		// 中断していたクエストの再開
		quest.started = true;
		updateLog(`📝 クエスト再開！『${def.title}』`, "quest");
	} else {
		updateLog("⚠️ すでに開始済みのクエストです！", "warning");
	}

	renderQuestList();
}

export function completeQuest(key) {
	const quest = player.quests[key];
	const def = questList[key];

	if (!quest || !def || quest.completed) return;

	quest.completed = true;
	quest.started = false;

	updateLog(`🎉 クエスト『${def.title}』達成！`, "quest");

	// 報酬が関数なら実行、オブジェクトなら共通処理
	if (typeof def.reward === "function") {
		def.reward();
	} else if (typeof def.reward === "object") {
		grantQuestReward(def);
	}

	renderQuestList();
	updateStatus();
}

// 報酬処理を共通化
export function grantQuestReward(quest) {
	const reward = quest.reward;
	if (!reward) return;

	if (reward.exp) {
		player.exp += reward.exp;
		updateLog(`📘 経験値 +${reward.exp}`, "info");
	}
	if (reward.gold) {
		player.gold = (player.gold || 0) + reward.gold;
		updateLog(`💰 ゴールド +${reward.gold}`, "info");
	}
	if (reward.potions) {
		player.potions += reward.potions;
		updateLog(`🧪 ポーション ×${reward.potions}`, "info");
	}
	if (reward.maxHp) {
		player.maxHp += reward.maxHp;
		updateLog(`💪 最大HP +${reward.maxHp}`, "info");
	}
	if (reward.items) {
		reward.items.forEach(item => {
			addItemToInventory(item.name, item.quantity || 1);
			updateLog(`🎁 ${item.name} ×${item.quantity || 1} を手に入れた！`, "item");
		});
	}
	if (reward.skill) {
		const skill = learnSkill(reward.skill);
		if (skill) {
			updateLog(`📘 スキル『${skill.name}』を習得した！`, "skill");
		}
	}
	updateStatus();
}

export function updateQuestProgress(key, amount = 1) {
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

export function checkQuestProgressOnKill(enemy) {
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
	const quest = player.quests[questKey];
	const def = questList[questKey];

	if (!quest || !def || !quest.started || quest.completed || quest.progress >= def.goal) {
		updateLog("ここには何もなさそうだ…");
		return;
	}

	// 🔒 連続採集制限：同じマスでの採集を防ぐ
	const currentPos = `${player.location.x},${player.location.y}`;
	if (player.lastGatherPosition === currentPos) {
		updateLog("⚠️ 同じ場所ではもう何も見つからなさそうだ…");
		return;
	}
	player.lastGatherPosition = currentPos;

	// 成功判定
	if (Math.random() < successRate) {
		quest.progress = Math.min(quest.progress + 1, def.goal);
		updateLog(`🌿 ${foundMessage}`);
		updateLog(`（${def.title} ${quest.progress} / ${def.goal}）`);

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
