import { updateLog } from "../ui/log.js";
import { updateStatus } from "../ui/status.js";
import { showStatUpgradeMenu } from "../ui/statUpgradeMenu.js";
import { player } from "./player.js";
import { getRandomInt } from "../utils/helpers.js";

// ステータス成長候補
const growthStats = [
	{ key: "Attack", label: "攻撃力", min: 1, max: 3 },
	{ key: "Defense", label: "防御力", min: 1, max: 2 },
	{ key: "Speed", label: "すばやさ", min: 1, max: 2 },
	{ key: "Crit", label: "会心率", min: 1, max: 2 },
	{ key: "Accuracy", label: "命中率", min: 1, max: 2 },
	{ key: "Recovery", label: "回復力", min: 1, max: 2 }
];

export function levelUp() {
	player.level++;
	player.exp = 0;
	player.nextExp += 10;

	// 固定成長
	player.maxHp += 10;
	player.maxMp += 5;
	player.hp = player.maxHp;
	player.mp = player.maxMp;

	// ランダム成長（1〜3個）
	const shuffled = [...growthStats].sort(() => Math.random() - 0.5);
	const chosen = shuffled.slice(0, getRandomInt(1, 3));
	const growthLog = [];

	chosen.forEach(stat => {
		const amount = getRandomInt(stat.min, stat.max);
		const baseKey = "base" + stat.key;
		player[baseKey] = (player[baseKey] || 0) + amount;
		growthLog.push(`🔹 ${stat.label} +${amount}`);
	});

	player.skills.points++;

	// ログ出力
	updateLog(`🆙 レベル ${player.level} にアップ！`, "success");
	updateLog(`❤️ 最大HP +10 / 🔷 最大MP +5`, "info");
	if (growthLog.length > 0) {
		updateLog(growthLog.join(" / "), "success");
	}
	updateLog("🎁 SPを1獲得！", "success");

	updateStatus();
	showStatUpgradeMenu();
}
