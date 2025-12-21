// 追加手順チェックリスト
// 手順	内容
// ✅ クエストデータ追加	questList.bossBattle を定義
// ✅ 村人データ追加	villagers.forestHermit を追加　villagers.js
// ✅ 必要に応じてマップデータを追加 mapData.js
// ✅ ボス戦処理に進行反映	handleBossTile() に progress = 1 を追加
// ✅ クエストログ更新	renderQuestList() が呼ばれていればOK

export const questList = {
	slimeHunt: {
		id: "slimeHunt",
		title: "スライム退治",
		description: "スライムを5体倒そう！",
		type: "kill",           // 討伐系クエスト
		target: "slime",        // 対象の敵タイプ
		goal: 5,
		autoComplete: false,
		repeatable: false,
		reward: {
			exp: 10,
			potions: 2
		}
	},

	herbGathering: {
		id: "herbGathering",
		title: "薬草集め",
		description: "草むらで薬草を7つ集めよう！",
		type: "gather",         // 採集系クエスト
		target: "herb",         // 採集対象
		goal: 7,
		prerequisite: "slimeHunt",
		autoComplete: false,
		repeatable: false,
		reward: {
			exp: 15,
			maxHp: 10
		}
	},

	lostRelic: {
		id: "bossBattle",
		title: "ドラゴン討伐",
		description: "森の奥に潜むドラゴンを倒そう！",
		type: "kill",
		target: "boss",
		goal: 1,
		prerequisite: "herbGathering",
		autoComplete: true,
		repeatable: false,
		reward: {
			exp: 100,
			gold: 200,
			items: [
				{ id: "dragonScale", name: "ドラゴンアーマー", quantity: 1 }
			]
		}
	}

	// 🔜 新しいクエストはここに追加していこう！
};
