import { updateLog } from "../ui/log.js";
import { updateStatus } from "../ui/status.js";
import { player } from "./player.js";
import { getRandomInt } from "../utils/helpers.js";

// ステータス成長候補
const growthStats = [
	{ key: "Attack", label: "攻撃力", min: 1, max: 3 },
	{ key: "Defense", label: "防御力", min: 1, max: 3 },
	{ key: "Speed", label: "すばやさ", min: 1, max: 2 },
	{ key: "Crit", label: "会心率", min: 0, max: 1 },
	{ key: "Accuracy", label: "命中率", min: 0, max: 1 },
	{ key: "Recovery", label: "回復力", min: 1, max: 2 },
	{ key: "Magic", label: "魔力", min: 1, max: 2 },
];

// レベルアップ処理
export function levelUp(logBuffer = []) {

	console.log("レベルアップ処理実行");

	player.exp -= player.nextExp;
	player.level++;
	player.nextExp = calculateNextExp(player.level);

	// 固定成長
	player.maxHp += 5;
	player.maxMp += 3;
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

	// ログ出力（バッファがあればそこに追加、なければ即時出力）
	const log = logBuffer || [];
	log.push({ text: `🆙 レベル ${player.level} にアップ！`, type: "info" });
	log.push({ text: `❤️ 最大HP +5 / 🔷 最大MP +3`, type: "info" });

	if (growthLog.length > 0) {
		log.push({ text: `${growthLog.join(" / ")}`, type: "info" });
	}
	log.push({ text: `🎁 SPを1獲得！`, type: "info" });

	if (logBuffer === null) {
		log.forEach(msg => updateLog(msg.text, msg.type));
	}

	updateStatus();
}

// レベルに応じて必要経験値を計算する関数
function calculateNextExp(level) {
	// 例：Lv1→15, Lv2→30, Lv3→50, Lv4→75, Lv5→105...
	return Math.floor(8 + level ** 1.4 * 4.5);
}
