// 🔜 新しい村人はここに追加！
export const villagers = {
	slimeQuestGiver: {
		id: "slimeQuestGiver",
		name: "村人のおじさん",
		questKey: "slimeHunt",
		location: {
			mapId: "village",
			x: 3,
			y: 2
		},
		sprite: "npc_oldman.png",
		dialogue: {
			intro: "スライムが増えて困ってるんだ…5体倒してくれないか？",
			inProgress: (quest) => {
				if (quest.progress >= 3) return "あと少しだ！頑張ってくれ！";
				return "スライム退治、よろしく頼んだよ！";
			},
			completed: "助かったよ！また何かあったら頼むね",
			thanks: "ありがとう！これはお礼だ！"
		}
	},
	herbGirl: {
		id: "herbGirl",
		name: "薬草好きの少女",
		questKey: "herbGathering",
		location: {
			mapId: "village",
			x: 5,
			y: 1
		},
		sprite: "npc_herb_girl.png",
		dialogue: {
			intro: "薬草を7つ集めてきてくれない？",
			inProgress: (quest) => {
				if (quest.progress >= 5) return "あともうちょっとだね！";
				return "薬草、まだかな〜？";
			},
			completed: "わぁ、ありがとう！",
			thanks: "これでおばあちゃんの薬が作れるよ！"
		}
	},
	forestHermit: {
		id: "forestHermit",
		name: "森の隠者",
		questKey: "bossBattle",
		location: {
			mapId: "deepForest",
			x: 7,
			y: 4
		},
		sprite: "npc_hermit.png",
		dialogue: {
			intro: "森の奥に潜むドラゴンを倒してくれんか？",
			inProgress: "ドラゴンはまだ生きておる…",
			completed: "おお、それじゃ！助かったぞ！",
			thanks: "これは礼じゃ。受け取ってくれ。"
		}
	},
};
