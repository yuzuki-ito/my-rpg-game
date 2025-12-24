import { updateLog } from "../ui/log.js";
import { player } from "./player.js";
import { items } from "../data/item.js";

// 敗北後の特別処理をまとめたハンドラ
export const defeatHandlers = {

    dragonDefeat: (buffer = []) => {
        buffer.unshift({ text: "🔥 ドラゴンを討伐した！", type: "success" });

        player.completedQuests ??= [];
        if (!player.completedQuests.includes("dragonHunt")) {
            player.completedQuests.push("dragonHunt");
        }
    },

    awakenedDragonDefeat: (buffer = []) => {
        buffer.push({ text: "⚡ 覚醒ドラゴンを倒した！", type: "success" });
        // 実績や称号などを追加してもOK
    },

    feralDragonDefeat: (buffer = []) => {
        player.completedQuests ??= [];
        player.titles ??= [];
        player.inventory ??= {};
        player.inventory.weapons ??= [];

        if (!player.completedQuests.includes("dragonHunt")) {
            buffer.push({ text: "🏆 特別な称号『竜を恐れぬ者』を獲得！", type: "success" });

            player.titles.push("竜を恐れぬ者");

            const reward = { ...items.legendaryBlade };
            player.inventory.weapons.push(reward);
            buffer.push({ text: `🗡️ ${reward.name} を手に入れた！（未装備）`, type: "item" });
        }
    },

    goldenslimeDefeat: (buffer = []) => {
        buffer.push({ text: "💰 ゴールデンスライムを倒した！", type: "success" });
        player.gold = (player.gold || 0) + 100;
        buffer.push({ text: "💎 100ゴールドを手に入れた！", type: "item" });
    }
};
