import { updateLog } from "../ui/log.js";
import { updateStatus } from "../ui/status.js";
import { drawMap } from "./map.js";
import { resetUI } from "../ui/ui.js";
import { playBGM } from "./audio.js";
import { initializeQuests } from "./quest.js";
import { player, setPlayerData } from "./player.js"; // setPlayerData を追加

const SAVE_KEY = "rpgSave";

/**
 * ゲームの状態をセーブする
 */
export function saveGame() {
	const saveData = {
		player,
		timestamp: Date.now()
	};
	localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
	updateLog("💾 ゲームをセーブした！");
}

/**
 * ゲームの状態をロードする
 */
export function loadGame() {
	const data = localStorage.getItem(SAVE_KEY);
	if (!data) {
		updateLog("❌ セーブデータが見つかりません！");
		return;
	}

	try {
		const parsed = JSON.parse(data);
		if (!parsed.player || typeof parsed.player !== "object") {
			throw new Error("不正なセーブデータ");
		}

		setPlayerData(parsed.player); // ← player に安全に上書き
		initializeQuests();
		drawMap();
		resetUI();
		updateStatus();
		playBGM("field");

		const date = new Date(parsed.timestamp);
		updateLog(`📂 ${date.toLocaleString()} のデータをロードしました！`, "green");
	} catch (err) {
		console.warn("セーブデータの読み込みに失敗:", err);
		updateLog("⚠️ セーブデータの読み込みに失敗しました！", "red");
	}
}
