// 🔜 新しい村人はここに追加！
export const villagers = {
	slimeQuestGiver: {
		id: "slimeQuestGiver",
		name: "村人のおじさん",
		questKey: "slimeHunt",
		location: {
			mapId: "main",
			x: 2,
			y: 2
		},
		sprite: "npc_oldman.png",
		icon: "🏠",
		dialogue: {
			intro: (quest) => `スライムを${quest.goal}体倒してくれないか？`,
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
			mapId: "main",
			x: 6,
			y: 4
		},
		sprite: "npc_herb_girl.png",
		icon: "🏠",
		dialogue: {
			intro: (quest) => `薬草を${quest.goal}つ集めてきてくれない？`,
			inProgress: (quest) => {
				if (quest.progress >= 5) return "あともうちょっとだね！";
				return "薬草、まだかな〜？";
			},
			completed: "これでおばあちゃんの薬が作れるよ！",
			thanks: "ありがとう！"
		}
	},
	forestHermit: {
		id: "forestHermit",
		name: "森の隠者",
		questKey: "bossBattle",
		location: {
			mapId: "main",
			x: 4,
			y: 6
		},
		sprite: "npc_hermit.png",
		icon: "🏠",
		dialogue: {
			intro: "森の奥に潜むドラゴンを倒してくれんか？",
			inProgress: "ドラゴンはまだ生きておる…",
			completed: "おお！助かったぞ！",
			thanks: "これは礼じゃ。受け取ってくれ。"
		}
	},
};
