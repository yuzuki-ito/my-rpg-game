import { updateLog } from "../ui/log.js";
import { player } from "./player.js";
import { items } from "../data/item.js";

// 敗北後の特別処理をまとめたハンドラ
export const defeatHandlers = {
    dragonDefeat: () => {
        updateLog("🔥 ドラゴンを討伐した！", "success");

        // ✅ 安全に初期化
        player.completedQuests ??= [];
        if (!player.completedQuests.includes("dragonHunt")) {
            player.completedQuests.push("dragonHunt");
        }
    },

    awakenedDragonDefeat: () => {
        updateLog("⚡ 覚醒ドラゴンを倒した！", "success");
        // 実績や称号などを追加してもOK
    },

    feralDragonDefeat: () => {
        player.completedQuests ??= [];
        player.titles ??= [];
        player.inventory ??= {};
        player.inventory.weapons ??= [];

        if (!player.completedQuests.includes("dragonHunt")) {
            updateLog("🏆 特別な称号『竜を恐れぬ者』を獲得！", "success");
            player.titles.push("竜を恐れぬ者");

            const reward = { ...items.legendaryBlade };
            player.inventory.weapons.push(reward);
            updateLog(`🗡️ ${reward.name} を手に入れた！（未装備）`, "item");
        }
    },

    goldenslimeDefeat: () => {
        updateLog("💰 ゴールデンスライムを倒した！", "success");
        player.gold = (player.gold || 0) + 100;
        updateLog("💎 100ゴールドを手に入れた！", "item");
    }
};
