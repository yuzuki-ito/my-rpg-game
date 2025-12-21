export const defeatHandlers = {
    goldenslimeDefeat: () => {
        updateLog("✨ ゴールデンスライムを倒した！何か特別なことが起こりそうだ…", "gold");
    },
    dragonDefeat: () => {
        updateLog("🔥 ドラゴンを討伐した！世界に平和が訪れた…", "orange");
    }
};
