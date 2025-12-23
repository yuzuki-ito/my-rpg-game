import { handleVillageTile, handleGrassTileEvent, handleBossTile, drawMap } from "../core/map.js";
import { updateLog } from "../ui/log.js";
import { playBGM } from "../core/audio.js";
import { mapMeta } from "../data/mapMeta.js";

export const TILE_INFO = {
    "🌲": {
        name: "森",
        passable: true,
        description: "うっそうと茂る木々。通れない。",
        color: "#2e7d32",
        weight: 5
    },
    "🌾": {
        name: "草原",
        passable: true,
        description: "風が気持ちよく吹き抜ける草原。",
        color: "#aee571",
        weight: 10
    },
    "🌿": {
        name: "草むら",
        passable: true,
        description: "何かが潜んでいそうな草むら。",
        event: "encounter",
        color: "#81c784",
        weight: 1,
        handler: (player) => handleGrassTileEvent(player) // ← 追加！
    },
    "🏠": {
        name: "村",
        passable: true,
        description: "休息と買い物ができる村。",
        event: "village",
        color: "#ffcc80",
        weight: 0,
        handler: (player) => handleVillageTile(player) // ← 追加！
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
        weight: 0,
        handler: (player) => {
            // 現在位置を記録
            player.returnPoint = {
                mapId: player.location.mapId,
                x: player.location.x,
                y: player.location.y
            };
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
            if (player.returnPoint) {
                player.location.mapId = player.returnPoint.mapId;
                player.location.x = player.returnPoint.x;
                player.location.y = player.returnPoint.y;
                updateLog("🏘️ 深い森から出た！");
                player.returnPoint = null; // 一度戻ったらリセット
            } else {
                // フォールバック（戻り先がない場合）
                player.location.mapId = "main";
                player.location.x = 2;
                player.location.y = 2;
                updateLog("🏘️ 深い森から出た！");
            }
            drawMap();
            playBGM(mapMeta[player.location.mapId]?.bgm);
        }
    }
};