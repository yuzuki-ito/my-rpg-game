import { handleVillageTile, handleGrassTileEvent, handleBossTile, drawMap } from "../core/map.js";
import { updateLog } from "../ui/log.js";
import { playBGM } from "../core/audio.js";

export const TILE_INFO = {
    "🌲": {
        name: "森",
        passable: false,
        description: "うっそうと茂る木々。通れない。",
        color: "#2e7d32"
    },
    "🌾": {
        name: "草原",
        passable: true,
        description: "風が気持ちよく吹き抜ける草原。",
        color: "#aee571"
    },
    "🌿": {
        name: "草むら",
        passable: true,
        description: "何かが潜んでいそうな草むら。",
        event: "encounter",
        color: "#81c784",
        handler: handleGrassTileEvent // ← 追加！
    },
    "🏠": {
        name: "村",
        passable: true,
        description: "休息と買い物ができる村。",
        event: "village",
        color: "#ffcc80",
        handler: handleVillageTile // ← 追加！
    },
    "👹": {
        name: "ボスエリア",
        passable: true,
        description: "強大な敵が待ち構えている…！",
        event: "boss",
        color: "#ef6c00",
        handler: (player) => handleBossTile(player) // ← ここを修正！
    },
    "🌳": {
        name: "深い森の入口",
        passable: true,
        description: "森の奥へと続く道がある…",
        color: "#4caf50",
        handler: (player) => {
            player.location.mapId = "deepForest";
            player.location.x = 1;
            player.location.y = 1;
            updateLog("🌲 深い森に足を踏み入れた…");
            drawMap();
            playBGM(mapMeta.deepForest.bgm);
        }
    },
    "🏡": {
        name: "村への道",
        passable: true,
        description: "村へと続く小道。",
        color: "#ffcc80",
        handler: (player) => {
            player.location.mapId = "main";
            player.location.x = 2;
            player.location.y = 2;
            updateLog("🏘️ 村に戻ってきた！");
            drawMap();
            playBGM(mapMeta.main.bgm);
        }
    }
};