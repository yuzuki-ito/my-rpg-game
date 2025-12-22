import { generateFullMap, generateDeepForestMap } from "../core/mapGenerator.js";
import { villagers } from "./villagers.js"; // 村人データ

// ====== マップサイズ ======
export const mapSize = 10;

// ====== マップデータ（絵文字ベース） ======
export let mapData = {
	main: [], // ← 初期化は空にしておく
	deepForest: []
};

export function generateMaps(player) {
	mapData.main = generateFullMap(mapSize, mapSize, villagers, false, player);
	mapData.deepForest = generateDeepForestMap(8, 5);
}