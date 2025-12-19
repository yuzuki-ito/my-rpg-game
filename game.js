const levelUpStats = [
	{ key: "attack", label: "攻撃力", min: 1, max: 3 },
	{ key: "defense", label: "防御力", min: 1, max: 3 },
	{ key: "speed", label: "すばやさ", min: 1, max: 3 },
	{ key: "crit", label: "会心率", min: 1, max: 3 },
	{ key: "accuracy", label: "命中率", min: 1, max: 3 },
	{ key: "recovery", label: "回復力", min: 1, max: 3 }
];

const villagers = {
	villager1: {
		name: "村人のおじさん",
		questKey: "slimeHunt",
		dialogue: {
			intro: "スライムが増えて困ってるんだ…3体倒してくれないか？",
			inProgress: "スライム退治、よろしく頼んだよ！",
			completed: "助かったよ！また何かあったら頼むね",
			thanks: "ありがとう！これはお礼だ！"
		}
	},
	villager2: {
		name: "薬草好きの少女",
		questKey: "herbGathering",
		dialogue: {
			intro: "薬草を5つ集めてきてくれない？",
			inProgress: "薬草、まだかな〜？",
			completed: "わぁ、ありがとう！",
			thanks: "これでおばあちゃんの薬が作れるよ！"
		}
	}
};

let inBattle = false;
let currentEnemy = null;
let playerTurn = true;

const mapSize = 10;
const mapData = [
	["🌲", "🌲", "🌲", "🌲", "🌲", "🌲", "🌲", "🌲", "🌲", "🌲"],
	["🌲", "🌲", "🌲", "🌲", "🌲", "🌾", "🌾", "🌾", "🌲", "🌲"],
	["🌲", "🌲", "🏠", "🌲", "🌲", "🌾", "🌿", "🌾", "🌲", "🌲"],
	["🌲", "🌲", "🌲", "🌲", "🌲", "🌾", "🌾", "🌾", "🌲", "🌿"],
	["🌲", "🌲", "🌲", "🌲", "🌿", "🌲", "🌲", "🌲", "🌲", "🌲"],
	["🌲", "🌾", "🌾", "🌾", "🌲", "🌲", "🌲", "🌲", "🌲", "🌲"],
	["🌲", "🌾", "🌲", "🌾", "🌲", "🌲", "🌲", "🌿", "🌲", "🌲"],
	["🌲", "🌾", "🌾", "🌾", "🌲", "🌲", "🌲", "🌲", "🌲", "🌲"],
	["🌲", "🌲", "🌲", "🌲", "🌲", "🌲", "🌲", "🌲", "🌲", "🌲"],
	["🌲", "🌲", "🌿", "🌲", "🌲", "🌲", "🌲", "🌲", "🌲", "👹"]
];

const rarityColors = {
	common: "#cccccc",       // グレー（明るすぎるなら濃く）
	uncommon: "#2e7d32",     // 濃い緑
	rare: "#1565c0",         // 濃い青
	epic: "#6a1b9a",         // 濃い紫
	legendary: "#ef6c00"     // 濃いオレンジ
};

const questList = {
	slimeHunt: {
		id: "slimeHunt", // ← 追加
		title: "スライム退治",
		description: "スライムを3体倒そう！",
		type: "kill", // ← 追加：討伐系
		target: "slime", // ← 追加：対象の敵タイプ
		goal: 3,
		autoComplete: false,
		reward: () => {
			player.potions += 2;
			updateLog("🎁 ポーション×2を手に入れた！");
		}
	},
	// 追加クエストの例
	herbGathering: {
		title: "薬草集め",
		description: "草むらで薬草を5つ集めよう！",
		prerequisite: "slimeHunt", // ← 追加
		goal: 5,
		autoComplete: false,
		reward: () => {
			player.maxHp += 10;
			updateLog("🎁 最大HPが10上がった！");
		}
	}
};

// スキルツリー定義
const skillTree = {
	fire: {
		name: "🔥 火の系統",
		skills: [
			{
				id: "fire",
				name: "ファイア",
				requiredLevel: 1,
				requires: null,
				cost: 1,
				mpCost: 3,
				learned: false,
				canMiss: true,
				targetType: "enemy",
				description: "小さな火球で敵単体を攻撃する",
				effect: () => {
					const damage = 10 + Math.floor(Math.random() * 5);
					return { type: "damage", value: damage, element: "fire" };
				}
			},
			{
				id: "fireball",
				name: "ファイアボール",
				requiredLevel: 5,
				requires: "fire",
				cost: 2,
				mpCost: 6,
				learned: false,
				canMiss: true,
				targetType: "enemy",
				description: "大きな火球で敵単体を攻撃する",
				effect: () => {
					const damage = 12 + Math.floor(Math.random() * 6);
					return { type: "damage", value: damage, element: "fire" };
				}
			},
			{
				id: "flameburst",
				name: "フレイムバースト",
				requiredLevel: 10,
				requires: "fireball",
				cost: 3,
				mpCost: 9,
				learned: false,
				canMiss: true,
				targetType: "enemy",
				description: "爆発する炎で大ダメージを与える",
				effect: () => {
					const damage = 20 + Math.floor(Math.random() * 10);
					return { type: "damage", value: damage, element: "fire" };
				}
			}
		]
	},
	heal: {
		name: "✨ 回復の系統",
		skills: [
			{
				id: "heal",
				name: "ヒール",
				requiredLevel: 1,
				requires: null,
				cost: 1,
				mpCost: 5,
				learned: false,
				canMiss: false,
				targetType: "self",
				description: "HPを少し回復",
				effect: () => {
					const heal = 15;
					return { type: "heal", value: heal };
				}
			}
		]
	}
};

// 戦闘中に使えるスキルを取得
function getLearnedSkills() {
	const skills = [];
	for (const branchKey in skillTree) {
		const branch = skillTree[branchKey];
		branch.skills.forEach(skill => {
			if (skill.learned && skill.effect) {
				skills.push(skill);
			}
		});
	}
	return skills;
}

// スキルツリー表示（確認専用）
function showSkillTreeMenu() {
	const container = document.getElementById("skill-tree-container");
	container.innerHTML = "";

	for (const branchKey in skillTree) {
		const branch = skillTree[branchKey];
		const branchDiv = document.createElement("div");
		branchDiv.className = "skill-branch";

		const title = document.createElement("h4");
		title.textContent = branch.name;
		branchDiv.appendChild(title);

		branch.skills.forEach((skill) => {
			const node = document.createElement("div");
			node.className = "skill-node";
			if (skill.learned) node.classList.add("learned");
			else node.classList.add("locked");

			node.textContent = `${skill.name}（Lv${skill.requiredLevel} / SP${skill.cost}）`;
			node.title = skill.description;

			branchDiv.appendChild(node);
		});

		container.appendChild(branchDiv);
	}

	document.getElementById("skill-tree-menu").style.display = "block";
	document.getElementById("modal-bg").style.display = "block";
}

function closeSkillTreeMenu() {
	document.getElementById("skill-tree-menu").style.display = "none";
	document.getElementById("modal-bg").style.display = "none";
}

// 初期化時に一度だけ登録！
document.getElementById("modal-bg").addEventListener("click", () => {
	closeSkillTreeMenu();
});

// スキル習得条件チェック
function canLearnSkill(skill) {
	if (player.level < skill.requiredLevel) return false;
	if (!skill.requires) return true;
	const requiredSkill = findSkillById(skill.requires);
	return requiredSkill && requiredSkill.learned;
}

// スキル検索
function findSkillById(id) {
	for (const branchKey in skillTree) {
		const skill = skillTree[branchKey].skills.find((s) => s.id === id);
		if (skill) return skill;
	}
	return null;
}

// グローバル公開
window.showSkillTreeMenu = showSkillTreeMenu;
window.closeSkillTreeMenu = closeSkillTreeMenu;

const MAX_INVENTORY = 10; // ← 好きな数に調整してね！

const equipmentList = {
	weapons: [{
		name: "木の剣",
		attack: 2,
		rarity: "common",
		critRate: 0.05, // 5%の確率でクリティカル
		critMultiplier: 2 // 2倍ダメージ
	}, {
		name: "鉄の剣",
		attack: 5,
		rarity: "uncommon",
		critRate: 0.1,
		critMultiplier: 2
	}, {
		name: "炎の剣",
		attack: 10,
		rarity: "rare",
		critRate: 0.2,
		critMultiplier: 2.5
	}],
	armors: [{
		name: "布の服",
		defense: 1,
		rarity: "common"
	}, {
		name: "鉄の鎧",
		defense: 4,
		rarity: "uncommon"
	}, {
		name: "ドラゴンアーマー",
		defense: 10,
		rarity: "rare"
	}]
};

const enemyPool = [
	// 通常モンスター
	{
		id: "slime",
		name: "スライム",
		type: "slime",
		spawnRate: 0.5, // 50%の確率で出現候補に
		baseLevel: 1,
		rarity: "common",
		hp: 20,
		attack: 4,
		speed: 2,
		accuracy: 90,
		exp: 5,
		image: "images/slime.png",
		dropTable: [
			{
				type: "armor",
				item: {
					name: "ボロい防具",
					defense: 1,
					rarity: "common"
				},
				chance: 0.5
			}
		]
	},
	{
		id: "goblin",
		name: "ゴブリン",
		type: "goblin",
		spawnRate: 0.3, // 30%の確率で出現候補に
		baseLevel: 2,
		rarity: "uncommon",
		hp: 30,
		attack: 6,
		speed: 3,
		accuracy: 92,
		exp: 8,
		image: "images/goblin.png",
		dropTable: [
			{
				type: "weapon",
				item: {
					name: "鋭い剣",
					attack: 5,
					rarity: "uncommon",
					critRate: 0.1,
					critMultiplier: 2
				},
				chance: 0.3
			}
		]
	},
	// レアモンスター
	{
		id: "goldenslime",
		name: "ゴールデンスライム",
		type: "goldenslime",
		spawnRate: 0.01, // 1%の確率で出現候補に
		baseLevel: 5,
		rarity: "legendary",
		hp: 50,
		attack: 10,
		speed: 8,
		accuracy: 95,
		exp: 100,
		image: "images/goldenslime.png",
		dropTable: [
			{
				type: "weapon",
				item: {
					name: "黄金の剣",
					attack: 30,
					rarity: "legendary",
					critRate: 0.3,
					critMultiplier: 3
				},
				chance: 0.01
			}
		]
	},
	// ボスモンスター
	{
		id: "dragon",
		name: "ドラゴン",
		type: "boss",
		spawnRate: 0.00, // 0%の確率で出現候補に
		baseLevel: 10,
		rarity: "epic",
		hp: 100,
		attack: 20,
		speed: 5,
		accuracy: 95,
		exp: 200,
		image: "images/dragon.png",
		dropTable: [
			{
				type: "armor",
				item: {
					name: "ドラゴンアーマー",
					defense: 10,
					rarity: "rare"
				},
				chance: 0.1
			}
		]
	}
];

function toggleMenu() {
	const menu = document.getElementById("extra-menu");
	const toggleBtn = document.querySelector("#menu-toggle button");
	const isOpen = menu.style.display === "flex";

	menu.style.display = isOpen ? "none" : "flex";
	toggleBtn.textContent = isOpen ? "📂 メニュー" : "📂 メニューを閉じる";
}

function addItemToInventory(item) {
	if (player.inventory.length >= MAX_INVENTORY) {
		updateLog(`📦 ${item.name} を拾えなかった（所持数がいっぱい）`);
		updateLog("🧹 所持品を整理してください！");
		showInventoryMenu(); // ← 自動で整理画面を開く！
		return false;
	}
	player.inventory.push(item);
	updateLog(`📦 ${item.name} を手に入れた！`);

	// 所持数が上限に近づいたら警告（任意）
	if (player.inventory.length === MAX_INVENTORY) {
		updateLog("⚠️ 所持品がいっぱいになりました！");
		showInventoryMenu(); // 整理を促す
	}

	return true;
}

// 自動初期化関数
function initializeQuests() {
	player.quests = player.quests || {};
	for (const key in questList) {
		if (!player.quests[key]) {
			player.quests[key] = {
				started: false,
				completed: false,
				progress: 0
			};
		}
	}
}

function checkQuestProgressOnKill(enemy) {
	for (const key in player.quests) {
		const quest = player.quests[key];
		const def = questList[key];
		if (!quest || !def || quest.completed || !quest.started) continue;

		if (def.type === "kill" && enemy.type === def.target) {
			updateQuestProgress(key);
		}
	}
}

function renderQuestList() {
	const list = document.getElementById("questList");
	list.innerHTML = "";

	for (const key in player.quests) {
		const quest = player.quests[key];
		const def = questList[key];
		if (!def) continue;

		const status = quest.completed
			? "✅ 達成済み"
			: quest.started
				? `進行中：${quest.progress}/${def.goal}`
				: "未受注";

		const entry = document.createElement("div");
		entry.innerHTML = `<strong>${def.title}</strong><br><small>${def.description}</small><br><em>${status}</em><hr>`;
		list.appendChild(entry);
	}
}

function toggleQuestLog() {
	const log = document.getElementById("questLog");
	const bg = document.getElementById("modal-bg");
	const isOpen = log.style.display === "block";

	log.style.display = isOpen ? "none" : "block";
	bg.style.display = isOpen ? "none" : "block";

	if (!isOpen) renderQuestList();
}

function closeQuestLog() {
	document.getElementById("questLog").style.display = "none";
	document.getElementById("modal-bg").style.display = "none";
}

function updateQuestProgress(key, amount = 1, autoComplete = true) {
	const quest = player.quests[key];
	const def = questList[key];
	if (!quest || !def || quest.completed) return;

	quest.progress += amount;
	updateLog(`📘『${def.title}』進行度：${quest.progress}/${def.goal}`);

	if (autoComplete && quest.progress >= def.goal) {
		completeQuest(key);
	}
}

// スライムクエストの進行処理
function talkToVillager() {
	const slimeQuest = player.quests.slimeHunt;

	if (!slimeQuest.started) {
		showDialogue("村人：『スライムが増えて困ってるんだ…3体倒してくれないか？』", ["引き受ける", "断る"], (choice) => {
			if (choice === "引き受ける") {
				slimeQuest.started = true;
				slimeQuest.progress = 0;
				updateLog("📝 クエスト開始！『スライムを3体倒そう』");
			} else {
				updateLog("村人：『そうか…残念だ』");
			}
		});
	} else if (!slimeQuest.completed) {
		updateLog("村人：『スライム退治、よろしく頼んだよ！』");
	} else {
		updateLog("村人：『助かったよ！また何かあったら頼むね』");
	}
}

// 薬草クエストの進行処理
function handleGrassTile() {
	const quest = player.quests.herbGathering;
	const def = questList.herbGathering;

	// クエスト進行中かつ未達成
	if (quest?.started && !quest.completed) {
		if (Math.random() < 0.6) {
			quest.progress++;
			updateLog("🌿 草むらで薬草を見つけた！");
			updateLog(`（薬草 ${quest.progress} / ${def.goal}）`);

			if (quest.progress >= def.goal && def.autoComplete) {
				completeQuest("herbGathering");
			}
		} else {
			updateLog("🌿 草むらを探したが、何も見つからなかった…");
		}
	} else {
		updateLog("🌿 草むらは静かだ…");
	}
}

// 汎用的な会話関数
function talkToVillagerById(id) {
	const villager = villagers[id];
	if (!villager) return;

	const quest = player.quests[villager.questKey];
	const def = questList[villager.questKey];

	if (!quest || !def) {
		updateLog(`${villager.name}：『こんにちは！』`);
		return;
	}

	if (!quest.started) {
		showDialogue(`${villager.name}：『${villager.dialogue.intro}』`, ["引き受ける", "断る"], (choice) => {
			if (choice === "引き受ける") {
				startQuest(villager.questKey);
			} else {
				updateLog(`${villager.name}：『そうか…残念だ』`);
			}
		});
	} else if (!quest.completed && quest.progress >= def.goal && def.autoComplete === false) {
		completeQuest(villager.questKey);
		updateLog(`${villager.name}：『${villager.dialogue.thanks}』`);
	} else if (!quest.completed) {
		updateLog(`${villager.name}：『${villager.dialogue.inProgress}』`);
	} else {
		updateLog(`${villager.name}：『${villager.dialogue.completed}』`);
	}
}

function startQuest(key) {
	const def = questList[key];
	if (!def) {
		updateLog("⚠️ クエストが存在しません！");
		return;
	}

	// 前提クエストの確認
	if (def.prerequisite && !player.quests[def.prerequisite]?.completed) {
		updateLog("⚠️ このクエストはまだ受けられません！");
		return;
	}

	const quest = player.quests[key];

	if (!quest) {
		player.quests[key] = {
			started: true,
			completed: false,
			progress: 0
		};
		updateLog(`📝 クエスト開始！『${def.title}』`);
	} else if (!quest.started) {
		quest.started = true;
		quest.progress = 0;
		updateLog(`📝 クエスト再開！『${def.title}』`);
	} else {
		updateLog("⚠️ すでに開始済みのクエストです！");
	}

	renderQuestList?.(); // クエストログがあれば更新
}

function completeQuest(key) {
	const quest = player.quests[key];
	const def = questList[key];

	if (!quest || !def || quest.completed) return;

	quest.completed = true;
	quest.started = false; // ← 明示的に終了状態に
	updateLog(`🎉 クエスト『${def.title}』達成！`);

	if (typeof def.reward === "function") {
		def.reward();
	}

	renderQuestList?.(); // ← クエストログがあれば更新
}

function log(message) {
	const logDiv = document.getElementById("log");
	const entry = document.createElement("div");
	entry.textContent = message;
	logDiv.appendChild(entry);
	logDiv.scrollTop = logDiv.scrollHeight;
}

function updateLog(message, color = null) {
	const log = document.getElementById("log");
	if (!log) return;

	const line = document.createElement("div");
	line.textContent = message;
	if (color) line.classList.add(color);
	line.classList.add("fade-in");
	log.appendChild(line);

	// 最大20行までに制限
	while (log.children.length > 20) {
		log.removeChild(log.firstChild);
	}

	log.scrollTop = log.scrollHeight;
}

function generateEnemy(level, options = {}) {
	const { forceType = null } = options;

	// 出現候補をフィルタリング
	let candidates = enemyPool.filter(e => {
		if (forceType) return e.type === forceType;
		return Math.random() < (e.spawnRate || 0);
	});

	// 候補がなければ通常敵からランダムに
	if (candidates.length === 0) {
		candidates = enemyPool.filter(e => e.type === "normal");
	}

	const base = structuredClone(candidates[Math.floor(Math.random() * candidates.length)]);

	// レベル補正
	const levelVariance = getRandomInt(-1, 2); // -1〜+2の範囲で変動
	const targetLevel = Math.max(1, level + levelVariance);
	const levelDiff = targetLevel - (base.baseLevel || 1);

	base.name = base.type === "rare" ? `${base.name}（レア）` : base.name;
	base.name += ` Lv${targetLevel}`;

	base.hp += levelDiff * 5;
	base.attack += Math.floor(levelDiff * 1.2);
	base.defense += Math.floor(levelDiff * 0.8);
	base.speed = (base.speed || 1) + Math.floor(levelDiff * 0.3);
	base.crit = (base.crit || 0) + Math.floor(levelDiff * 0.2);
	base.exp += levelDiff * 5;

	base.hp = Math.max(1, base.hp);
	base.attack = Math.max(1, base.attack);
	base.defense = Math.max(0, base.defense);

	// ドロップ抽選（1つだけ）
	base.drop = null;
	if (base.dropTable && base.dropTable.length > 0) {
		for (const entry of base.dropTable) {
			if (Math.random() < entry.chance) {
				base.drop = entry;
				break;
			}
		}
	}

	return base;
}

function getRarity() {
	const roll = Math.random();
	if (roll > 0.9) return "rare";
	if (roll > 0.6) return "uncommon";
	return "common";
}

function generateDrop(level, rarity) {
	const isWeapon = Math.random() < 0.5;
	if (isWeapon) {
		return {
			type: "weapon",
			item: {
				name: `${rarity === "rare" ? "伝説の" : rarity === "uncommon" ? "鋭い" : "古びた"}剣`,
				attack: 2 + level + (rarity === "rare" ? 5 : rarity === "uncommon" ? 2 : 0),
				rarity,
				critRate: rarity === "rare" ? 0.2 : 0.05,
				critMultiplier: rarity === "rare" ? 2.5 : 2
			},
			chance: rarity === "rare" ? 0.3 : 0.6
		};
	} else {
		return {
			type: "armor",
			item: {
				name: `${rarity === "rare" ? "神秘の" : rarity === "uncommon" ? "頑丈な" : "ボロい"}防具`,
				defense: 1 + level + (rarity === "rare" ? 4 : rarity === "uncommon" ? 2 : 0),
				rarity
			},
			chance: rarity === "rare" ? 0.3 : 0.6
		};
	}
}

function showEquipMenu() {
	const menu = document.getElementById("levelup-menu");
	const bg = document.getElementById("modal-bg");
	menu.innerHTML = `<h3>装備変更・整理（${player.inventory.length} / ${MAX_INVENTORY}）</h3>`;

	const weaponTitle = document.createElement("p");
	weaponTitle.textContent = "武器";
	menu.appendChild(weaponTitle);

	equipmentList.weapons.forEach(item => {
		const btn = document.createElement("button");
		btn.textContent = `${item.name}（攻撃+${item.attack}）`;
		btn.onclick = () => {
			player.weapon = item;
			updateLog(`『${item.name}』を装備した！`);
			updateStatus();
			showEquipMenu();
		};
		menu.appendChild(btn);
	});

	const armorTitle = document.createElement("p");
	armorTitle.textContent = "防具";
	menu.appendChild(armorTitle);

	equipmentList.armors.forEach(item => {
		const btn = document.createElement("button");
		btn.textContent = `${item.name}（防御+${item.defense}）`;
		btn.onclick = () => {
			player.armor = item;
			updateLog(`『${item.name}』を装備した！`);
			updateStatus();
			showEquipMenu();
		};
		menu.appendChild(btn);
	});

	const close = document.createElement("button");
	close.textContent = "閉じる";
	close.onclick = () => {
		menu.style.display = "none";
		bg.style.display = "none";
	};
	menu.appendChild(close);

	menu.style.display = "block";
	bg.style.display = "block";
}

function updateStatus() {
	const status = document.getElementById("status");
	if (!status) return;

	const hpPercent = Math.floor((player.hp / player.maxHp) * 100);
	const mpPercent = Math.floor((player.mp / player.maxMp) * 100);

	status.innerHTML =
		`
    <strong>${player.name}</strong>　Lv.${player.level}<br>
    HP: ${player.hp} / ${player.maxHp}
    <div class="hp-bar"><div class="hp-fill" style="width:${hpPercent}%"></div></div>
    MP: ${player.mp} / ${player.maxMp}
    <div class="mp-bar"><div class="mp-fill" style="width:${mpPercent}%"></div></div>
    EXP: ${player.exp} / ${player.nextExp}<br>
    ポーション: ${player.potions}　SP: ${player.sp}<br>
    武器: ${player.weapon ? player.weapon.name : "なし"}<br>
    防具: ${player.armor ? player.armor.name : "なし"}<br>
    `;

	const hpFill = document.querySelector(".hp-fill");
	if (hpFill) {
		if (hpPercent < 30) {
			hpFill.classList.add("low");
		} else {
			hpFill.classList.remove("low");
		}
	}
}

function drawMap() {
	const map = document.getElementById("map");
	if (!map) {
		console.warn("#map が見つからないよ！");
		return;
	}

	let output = "";
	for (let y = 0; y < mapSize; y++) {
		for (let x = 0; x < mapSize; x++) {
			output += (player.x === x && player.y === y) ? "🧍" : mapData[y][x];
		}
		output += "\n";
	}
	map.textContent = output;
}

function showEnemyImage(src) {
	const img = document.getElementById("enemy-img");
	if (!img) return;

	if (src) {
		img.src = src;
		img.style.display = "block";

		// レアモンスターなら光らせる
		if (currentEnemy?.rare) {
			img.classList.add("rare-glow");
		} else {
			img.classList.remove("rare-glow");
		}
	} else {
		img.style.display = "none";
		img.classList.remove("rare-glow");
	}
}

function playBGM(type) {
	const field = document.getElementById("bgm-field");
	const battle = document.getElementById("bgm-battle");
	if (type === "battle") {
		field.pause();
		battle.currentTime = 0;
		battle.play();
	} else {
		battle.pause();
		field.currentTime = 0;
		field.play();
	}
}

function battle(enemyTemplate) {
	currentEnemy = structuredClone(enemyTemplate); // ← より安全なコピー
	inBattle = true;
	playerTurn = null;

	announceEnemyAppearance(currentEnemy);
	showEnemyImage(currentEnemy.image);
	playBGM("battle");
	updateStatus();

	determineTurnOrder();
}

function announceEnemyAppearance(enemy) {
	if (enemy.name.includes("レア")) {
		updateLog(`✨✨ ${enemy.name} が現れた！✨✨`, "gold");
	} else {
		updateLog(`⚔️ ${enemy.name} が現れた！`, "red");
	}
}

function determineTurnOrder() {
	const playerSpeed = player.speed || 0;
	const enemySpeed = currentEnemy.speed || 0;

	if (playerSpeed >= enemySpeed) {
		playerTurn = true;
		updateLog("あなたが先手を取った！");
	} else {
		playerTurn = false;
		updateLog(`${currentEnemy.name} が先に動いた！`);
		setTimeout(() => {
			enemyAttack(currentEnemy);
			playerTurn = true;
		}, 500);
	}
}

function attack() {
	if (!currentEnemy) return;

	// 命中判定
	if (!didHit(player.accuracy || 100, currentEnemy.speed || 0)) {
		updateLog("😵 攻撃が外れた！");
		endPlayerTurn();
		return;
	}

	// ダメージ計算
	let baseDamage = player.attack + (player.weapon?.attack || 0);
	let isCritical = false;

	const totalCritRate = (player.crit || 0) / 100 + (player.weapon?.critRate || 0);
	if (Math.random() < totalCritRate) {
		const critMultiplier = player.weapon?.critMultiplier || 2;
		baseDamage *= critMultiplier;
		isCritical = true;
	}

	const damage = Math.floor(baseDamage);
	currentEnemy.hp -= damage;

	// ログ表示
	if (isCritical) updateLog("💥 クリティカルヒット！", "orange");
	updateLog(`${currentEnemy.name} に ${damage} のダメージを与えた！`);

	updateStatus();

	// 撃破判定
	if (currentEnemy.hp <= 0) {
		handleEnemyDefeat();
	} else {
		endPlayerTurn();
	}
}

function castSkill(name) {
	if (!inBattle) return updateLog("スキルは戦闘中にしか使えないよ！");
	if (!playerTurn) return updateLog("今は相手のターンだよ！");
	if (player.hp <= 0) return updateLog("気絶していてスキルを使えない…！");

	const skill = getLearnedSkills().find(s => s.name === name);
	if (!skill) return updateLog(`『${name}』はまだ習得していないか、使えないスキルです！`);
	if (player.mp < skill.mpCost) return updateLog("MPが足りない！");

	player.mp -= skill.mpCost;

	// 命中判定（canMiss が true のとき）
	if (skill.canMiss && !didHit(player.accuracy || 100, currentEnemy.speed || 0)) {
		updateLog("😵 スキルが外れた！");
		endPlayerTurn();
		return;
	}

	// スキル効果を実行
	const result = skill.effect();

	if (result?.type === "damage") {
		currentEnemy.hp -= result.value;
		updateLog(`🔥 ${skill.name}！${currentEnemy.name} に ${result.value} ダメージ！`, "orange");
	} else if (result?.type === "heal") {
		player.hp = Math.min(player.maxHp, player.hp + result.value);
		updateLog(`✨ ${skill.name} でHPを${result.value}回復！`, "blue");
	}

	updateStatus();

	// 撃破判定
	if (currentEnemy.hp <= 0) {
		handleEnemyDefeat();
	} else {
		endPlayerTurn();
	}
}

function didHit(accuracy, targetSpeed) {
	const evasion = (targetSpeed || 0) * 2;
	const hitChance = Math.max(0.1, (accuracy - evasion) / 100);
	return Math.random() < hitChance;
}

function endPlayerTurn() {
	playerTurn = false;
	setTimeout(() => {
		enemyAttack(currentEnemy);
		playerTurn = true;
	}, 500);
}

function handleEnemyDefeat() {
	checkQuestProgressOnKill(currentEnemy);

	updateLog(`${currentEnemy.name} をたおした！`, "green");
	player.exp += currentEnemy.exp;

	if (currentEnemy.drop) {
		const roll = Math.random();
		if (roll < currentEnemy.drop.chance) {
			const drop = currentEnemy.drop;
			obtainEquipment(drop.type, drop.item);

			if (drop.type === "weapon") {
				player.weapon = drop.item;
				updateLog(`『${drop.item.name}』を装備した！`);
			} else if (drop.type === "armor") {
				player.armor = drop.item;
				updateLog(`『${drop.item.name}』を装備した！`);
			}
		}
	}

	if (player.exp >= player.nextExp) {
		levelUp();
	}

	inBattle = false;
	currentEnemy = null;
	showEnemyImage(null);
	playBGM("field");
	updateStatus();
}

function openSkillMenu() {
	const menu = document.getElementById("skill-menu");
	const bg = document.getElementById("modal-bg");

	menu.innerHTML = "<h3>スキル</h3>";

	const skills = getLearnedSkills();

	if (skills.length === 0) {
		const msg = document.createElement("p");
		msg.textContent = "まだスキルを習得していません。";
		menu.appendChild(msg);
	} else {
		const mpInfo = document.createElement("p");
		mpInfo.textContent = `現在のMP：${player.mp} / ${player.maxMp}`;
		mpInfo.style.color = "#ccc";
		mpInfo.style.marginBottom = "10px";
		menu.appendChild(mpInfo);

		skills.forEach(skill => {
			const btn = document.createElement("button");
			btn.textContent = `${skill.name}（MP${skill.mpCost}） - ${skill.description}`;

			if (player.mp < skill.mpCost) {
				btn.disabled = true;
				btn.classList.add("skill-unavailable");
			} else {
				btn.onclick = () => {
					closeSkillMenu();
					player.mp -= skill.mpCost;
					skill.effect(currentEnemy);
					updateStatus();
					enemyAttack(currentEnemy);
				};
			}

			menu.appendChild(btn);
		});
	}

	menu.style.display = "block";
	bg.style.display = "block";
}

function closeSkillMenu() {
	document.getElementById("skill-menu").style.display = "none";
	document.getElementById("modal-bg").style.display = "none";
}

function obtainEquipment(type, item, autoEquip = false) {
	const color = rarityColors[item.rarity] || "white";

	if (type === "weapon") {
		player.inventory.weapons.push(item);
		updateLog(`🗡️ ${item.name} を手に入れた！`, color);
		if (autoEquip) {
			player.weapon = item;
			updateLog(`『${item.name}』を装備した！`);
		}
	} else if (type === "armor") {
		player.inventory.armors.push(item);
		updateLog(`🛡️ ${item.name} を手に入れた！`, color);
		if (autoEquip) {
			player.armor = item;
			updateLog(`『${item.name}』を装備した！`);
		}
	}

	updateStatus();
}

function enemyAttack(enemy) {
	if (!enemy || typeof enemy.attack !== "number") {
		console.warn("敵が存在しないか、攻撃力が未定義です");
		return;
	}

	const rawDamage = Math.floor(Math.random() * enemy.attack) + 1;
	const armorDef = player.armor ? player.armor.defense : 0;
	const damage = Math.max(0, rawDamage - armorDef);
	player.hp -= damage;

	updateLog(`${enemy.name} の攻撃！${damage} ダメージを受けた！`, "red");
	updateStatus();

	if (player.hp <= 0) {
		updateLog("勇者はたおれてしまった… ゲームオーバー。", "red");
		updateLog("💡『ロード』ボタンでセーブデータを読み込んで再挑戦できるよ！");
		updateLog("💡または『F5キー』でゲームを最初からやり直せるよ！");
		currentEnemy = null;
		inBattle = false;
		showEnemyImage(null);
		playBGM("field");
	}
}

function move(dir) {
	if (player.hp <= 0 || inBattle) return;

	if (dir === "up" && player.y > 0) player.y--;
	if (dir === "down" && player.y < mapSize - 1) player.y++;
	if (dir === "left" && player.x > 0) player.x--;
	if (dir === "right" && player.x < mapSize - 1) player.x++;
	drawMap();
	player.hasActedThisTurn = false; // ← ここで毎回リセット！

	const tile = mapData[player.y][player.x];

	// 家に入ったとき
	if (tile === "🏠") {
		let targetVillager = "villager1"; // デフォルト

		// 例：薬草クエストが未開始で、スライム退治が終わっていたら villager2 に切り替え
		if (
			player.quests.slimeHunt?.completed &&
			!player.quests.herbGathering?.started
		) {
			targetVillager = "villager2";
		}

		talkToVillagerById(targetVillager);

		// 回復処理（共通）
		if (player.hp < player.maxHp) {
			player.hp = player.maxHp;
			player.mp = player.maxMp;
			updateLog("村で休んでHPとMPが全回復した！");
			updateStatus();
		}
		playBGM("field");
	} else if (tile === "🌿") { // 草むらに入ったとき
		updateLog("草むらに入った…");
		const roll = Math.random();
		if (roll < 0.5) {
			const enemy = generateEnemy(player.level, { forceType: "goblin" });
			updateLog("🌿 草むらからゴブリンが飛び出してきた！");
			battle(enemy);
		} else if (roll < 0.8) {
			handleGrassTile(); // 薬草クエスト処理
		} else {
			updateLog("🌿 風がそよそよ…何も見つからなかった。");
		}
	} else if (tile === "👹") {
		updateLog("ボス『ドラゴン』が現れた！");
		const boss = generateEnemy(player.level, { forceType: "boss" });
		battle(boss);
	} else {
		const chance = Math.random();
		if (chance < 0.3) {
			const enemy = generateEnemy(player.level);
			console.log(enemy.image)
			battle(enemy);
		} else if (chance < 0.4) {
			findItem();
		} else {
			updateLog("辺りは静かだ…");
		}
	}
}

function findItem() {
	player.potions++;
	updateLog("ポーションを見つけた！", "green");
	updateStatus();
}

function openTreasureChest() {
	const reward = equipmentList.weapons[2]; // 例：炎の剣
	updateLog("宝箱を開けた！中には…");
	updateLog(`🔥 ${reward.name} を手に入れた！`, "blue");
	player.weapon = reward;
	updateLog(`『${reward.name}』を装備した！`);
	updateStatus();
}

function showInventoryMenu() {
	const menu = document.getElementById("inventory-menu");
	const bg = document.getElementById("modal-bg");

	const weaponCount = player.inventory.weapons.length;
	const armorCount = player.inventory.armors.length;
	const totalCount = weaponCount + armorCount;

	menu.innerHTML = `<h3>🎒 所持品から装備（${totalCount} / ${MAX_INVENTORY}）</h3>`;

	if (totalCount >= MAX_INVENTORY - 2) {
		const hint = document.createElement("p");
		hint.style.marginBottom = "10px";
		hint.style.fontSize = "0.9em";
		hint.style.color = "#555";
		hint.innerHTML = `
        🧹 所持品がいっぱいです。<strong>「捨てる」</strong>や
        <strong>「合成」</strong>で整理しましょう！`;
		menu.appendChild(hint);
	}

	const isEquipped = (item, type) => {
		if (type === "weapon") return player.weapon === item;
		if (type === "armor") return player.armor === item;
		return false;
	};

	const isCombinable = (item, list) => {
		return list.filter(i => i.name === item.name).length >= 2;
	};

	// 武器一覧
	const weaponTitle = document.createElement("p");
	weaponTitle.textContent = "武器";
	menu.appendChild(weaponTitle);

	if (weaponCount === 0) {
		menu.appendChild(document.createTextNode("武器を持っていません"));
	} else {
		player.inventory.weapons.forEach((item, index) => {
			const wrapper = document.createElement("div");

			const label = isEquipped(item, "weapon") ? "★" : "";
			const btn = document.createElement("button");
			btn.textContent = `${label}${item.name}（攻撃+${item.attack}）`;
			btn.style.color = rarityColors[item.rarity] || "white";
			btn.onclick = () => {
				player.weapon = item;
				updateLog(`『${item.name}』を装備した！`);
				updateStatus();
				showInventoryMenu();
			};
			wrapper.appendChild(btn);

			const drop = document.createElement("button");
			drop.textContent = "捨てる";
			drop.onclick = () => {
				// 装備中なら外す
				if (player.weapon === item) {
					player.weapon = null;
					updateLog(`『${item.name}』を外した`);
				}
				player.inventory.weapons.splice(index, 1);
				updateLog(`${item.name} を捨てた`);
				updateStatus();
				refreshStatusScreen(); // ステータス画面が開いてたら再描画
				showInventoryMenu();
			};
			wrapper.appendChild(drop);

			if (isCombinable(item, player.inventory.weapons)) {
				const combine = document.createElement("button");
				combine.textContent = "合成";
				combine.onclick = () => {
					let removed = 0;
					player.inventory.weapons = player.inventory.weapons.filter(i => {
						if (i.name === item.name && removed < 2) {
							removed++;
							return false;
						}
						return true;
					});
					const upgraded = {
						...item,
						name: item.name + "＋",
						attack: item.attack + 1
					};
					player.inventory.weapons.push(upgraded);
					updateLog(`${item.name} を合成して ${upgraded.name} を作った！`);
					showInventoryMenu();
				};
				wrapper.appendChild(combine);
			}

			menu.appendChild(wrapper);
		});
	}

	// 防具一覧
	const armorTitle = document.createElement("p");
	armorTitle.textContent = "防具";
	menu.appendChild(armorTitle);

	if (armorCount === 0) {
		menu.appendChild(document.createTextNode("防具を持っていません"));
	} else {
		player.inventory.armors.forEach((item, index) => {
			const wrapper = document.createElement("div");

			const label = isEquipped(item, "armor") ? "★" : "";
			const btn = document.createElement("button");
			btn.textContent = `${label}${item.name}（防御+${item.defense}）`;
			btn.style.color = rarityColors[item.rarity] || "white";
			btn.onclick = () => {
				player.armor = item;
				updateLog(`『${item.name}』を装備した！`);
				updateStatus();
				showInventoryMenu();
			};
			wrapper.appendChild(btn);

			const drop = document.createElement("button");
			drop.textContent = "捨てる";
			drop.onclick = () => {
				if (player.armor === item) {
					player.armor = null;
					updateLog(`『${item.name}』を外した`);
				}
				player.inventory.armors.splice(index, 1);
				updateLog(`${item.name} を捨てた`);
				updateStatus();
				refreshStatusScreen();
				showInventoryMenu();
			};
			wrapper.appendChild(drop);

			if (isCombinable(item, player.inventory.armors)) {
				const combine = document.createElement("button");
				combine.textContent = "合成";
				combine.onclick = () => {
					let removed = 0;
					player.inventory.armors = player.inventory.armors.filter(i => {
						if (i.name === item.name && removed < 2) {
							removed++;
							return false;
						}
						return true;
					});
					const upgraded = {
						...item,
						name: item.name + "＋",
						defense: item.defense + 1
					};
					player.inventory.armors.push(upgraded);
					updateLog(`${item.name} を合成して ${upgraded.name} を作った！`);
					showInventoryMenu();
				};
				wrapper.appendChild(combine);
			}

			menu.appendChild(wrapper);
		});
	}

	menu.style.display = "block";
	bg.style.display = "block";
}

function refreshStatusScreen() {
	const screen = document.getElementById("status-screen");
	if (screen && screen.style.display === "block") {
		toggleStatus(); // 閉じて
		toggleStatus(); // 再表示して再描画
	}
}

function usePotion() {
	if (player.hasActedThisTurn) {
		updateLog("今はもう回復できない！");
		return;
	}
	if (player.potions <= 0) {
		updateLog("ポーションがない！");
		return;
	}
	if (player.hp >= player.maxHp) {
		updateLog("HPはすでに満タンだ！");
		return;
	}

	player.potions--;
	const heal = 20;
	player.hp = Math.min(player.maxHp, player.hp + heal);
	player.hasActedThisTurn = true; // ← 回復行動済みにする！
	updateLog(`🧪 ポーションでHPを${heal}回復した！`, "green");
	updateStatus();
}

function rest() {
	if (inBattle) {
		updateLog("⚔️ 戦闘中は休めない！");
		return;
	}

	if (player.hasActedThisTurn) {
		updateLog("今はもう休めない！");
		return;
	}

	const baseHp = 5;
	const baseMp = 2;
	const healHp = baseHp + (player.recovery || 0);
	const healMp = baseMp + Math.floor((player.recovery || 0) / 2);

	player.hp = Math.min(player.maxHp, player.hp + healHp);
	player.mp = Math.min(player.maxMp, player.mp + healMp);
	player.hasActedThisTurn = true;

	updateLog(`🌿 少し休んでHPを${healHp}、MPを${healMp}回復した`);
	updateStatus();
}

function saveGame() {
	localStorage.setItem("rpgSave", JSON.stringify(player));
	updateLog("ゲームをセーブした！");
}

function loadGame() {
	const data = localStorage.getItem("rpgSave");
	if (data) {
		player = JSON.parse(data);

		// クエストの初期化（不足分を補う）
		initializeQuests();

		drawMap();
		updateLog("ゲームをロードした！");
		resetUI();
		updateStatus();
		playBGM("field");
	} else {
		updateLog("セーブデータが見つからない！");
	}
}

function resetUI() {
	const menus = [
		"levelup-menu",
		"skill-menu",
		"learn-skill-menu",
		"status-screen",
		"modal-bg"
	];
	menus.forEach(id => {
		const el = document.getElementById(id);
		if (el) el.style.display = "none";
	});
	showEnemyImage(null);

	inBattle = false;
	currentEnemy = null;
}

function levelUp() {
	player.level++;
	player.exp = 0;
	player.nextExp += 10;

	// 固定強化
	player.maxHp += 10;
	player.maxMp += 5;
	player.hp = player.maxHp;
	player.mp = player.maxMp;

	// ランダム強化（1〜3個のステータスをランダムに強化）
	const possibleStats = [
		{ key: "attack", label: "攻撃力", min: 1, max: 3 },
		{ key: "defense", label: "防御力", min: 1, max: 2 },
		{ key: "speed", label: "すばやさ", min: 1, max: 2 },
		{ key: "crit", label: "会心率", min: 1, max: 2 },
		{ key: "accuracy", label: "命中率", min: 1, max: 2 },
		{ key: "recovery", label: "回復力", min: 1, max: 2 }
	];

	const shuffle = arr => arr.sort(() => Math.random() - 0.5);
	const chosenStats = shuffle(possibleStats).slice(0, getRandomInt(1, 3));
	const logMessages = [];

	chosenStats.forEach(stat => {
		const amount = getRandomInt(stat.min, stat.max);
		player[stat.key] = (player[stat.key] || 0) + amount;
		logMessages.push(`${stat.label} +${amount}`);
	});

	player.sp++;

	updateLog(`🆙 レベル${player.level}にアップ！`);
	updateLog(`✨ ${logMessages.join(" / ")}`);
	updateLog("🎁 SPを1獲得！");
	updateStatus();

	showStatUpgradeMenu(); // ← 自動で強化メニュー表示
}

// ランダム整数ユーティリティ
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 装備補正を計算する関数
function getTotalStat(base, bonus, equipmentBonus = 0) {
	return (base || 0) + (bonus || 0) + (equipmentBonus || 0);
}

//装備補正を取得する関数
function getEquipmentBonus(statKey) {
	let bonus = 0;
	if (player.weapon && player.weapon[statKey]) {
		bonus += player.weapon[statKey];
	}
	if (player.armor && player.armor[statKey]) {
		bonus += player.armor[statKey];
	}
	return bonus;
}

function showLearnSkillMenu() {
	const menu = document.getElementById("learn-skill-menu");
	const bg = document.getElementById("modal-bg");

	menu.innerHTML = "";
	const header = document.createElement("h3");
	header.textContent = `✨ スキル習得（残りSP: ${player.sp}）`;
	menu.appendChild(header);

	let anyAvailable = false;

	for (const branchKey in skillTree) {
		const branch = skillTree[branchKey];
		const branchTitle = document.createElement("h4");
		branchTitle.textContent = branch.name;
		menu.appendChild(branchTitle);

		branch.skills.forEach(skill => {
			if (!skill.learned && canLearnSkill(skill)) {
				anyAvailable = true;
				const btn = document.createElement("button");
				btn.textContent = `${skill.name}（Lv${skill.requiredLevel} / SP${skill.cost}） - ${skill.description}`;

				if (player.sp < skill.cost) {
					btn.disabled = true;
					btn.classList.add("skill-unavailable");
				} else {
					btn.onclick = () => {
						skill.learned = true;
						player.sp -= skill.cost;
						updateLog(`🧠 新しいスキル『${skill.name}』を習得した！（SP -${skill.cost}）`);
						updateStatus();
						showLearnSkillMenu(); // 再描画
					};
				}

				menu.appendChild(btn);
			}
		});
	}

	if (!anyAvailable) {
		const msg = document.createElement("p");
		msg.textContent = "習得可能なスキルはありません。";
		menu.appendChild(msg);
	}

	menu.style.display = "block";
	bg.style.display = "block";
}
window.showLearnSkillMenu = showLearnSkillMenu;

function showStatUpgradeMenu() {
	const menu = document.getElementById("levelup-menu");
	const bg = document.getElementById("modal-bg");

	menu.innerHTML = "";

	const header = document.createElement("h3");
	header.textContent = `📈 ステータス強化（残りSP: ${player.sp}）`;
	menu.appendChild(header);

	const upgrades = [
		{
			label: "最大HP +5",
			apply: () => player.maxHp += 5
		},
		{
			label: "最大MP +3",
			apply: () => player.maxMp += 3
		},
		{
			label: "攻撃力 +1",
			apply: () => player.attackBonus += 1
		},
		{
			label: "防御力 +1",
			apply: () => player.defenseBonus += 1
		},
		{
			label: "すばやさ +1",
			apply: () => player.speedBonus += 1
		},
		{
			label: "会心率 +1%",
			apply: () => player.critBonus += 1
		},
		{
			label: "命中率 +1%",
			apply: () => player.accuracyBonus += 1
		},
		{
			label: "回復力 +1",
			apply: () => player.recoveryBonus += 1
		}
	];

	upgrades.forEach(upg => {
		const btn = document.createElement("button");
		btn.textContent = upg.label;
		btn.onclick = () => {
			if (player.sp > 0) {
				upg.apply();
				player.sp--;
				updateLog(`🔧 ${upg.label} を強化した！`);
				updateStatus();
				showStatUpgradeMenu(); // 再描画
			} else {
				updateLog("SPが足りない！");
			}
		};
		menu.appendChild(btn);
	});

	menu.style.display = "block";
	bg.style.display = "block";
}

function getEquipmentBonus(statKey) {
	let bonus = 0;
	if (player.weapon && player.weapon[statKey]) {
		bonus += player.weapon[statKey];
	}
	if (player.armor && player.armor[statKey]) {
		bonus += player.armor[statKey];
	}
	return bonus;
}

function getTotalStat(base, bonus, equip) {
	return (base || 0) + (bonus || 0) + (equip || 0);
}

function toggleStatus() {
	const screen = document.getElementById("status-screen");
	const bg = document.getElementById("modal-bg");
	const isOpen = screen.style.display === "block";

	if (isOpen) {
		screen.style.display = "none";
		bg.style.display = "none";
		return;
	}

	const stats = [
		{ key: "attack", label: "攻撃力" },
		{ key: "defense", label: "防御力" },
		{ key: "speed", label: "すばやさ" },
		{ key: "crit", label: "会心率", suffix: "%" },
		{ key: "accuracy", label: "命中率", suffix: "%" },
		{ key: "recovery", label: "回復力" }
	];

	let html = `<h3>📊 ステータス詳細</h3>`;

	stats.forEach(stat => {
		const base = player[stat.key] || 0;
		const bonus = player[`${stat.key}Bonus`] || 0;
		const equip = getEquipmentBonus(stat.key);
		const total = getTotalStat(base, bonus, equip);
		const suffix = stat.suffix || "";
		html += `<p>${stat.label}：${total}${suffix}（基本:${base} + 補正:${bonus} + 装備:${equip}）</p>`;
	});

	html += `
        <hr>
        <p>武器：${player.weapon ? player.weapon.name : "なし"}</p>
        <p>防具：${player.armor ? player.armor.name : "なし"}</p>
    `;

	screen.innerHTML = html;
	screen.style.display = "block";
	bg.style.display = "block";
}

function showDialogue(text, choices, callback) {
	const menu = document.getElementById("levelup-menu");
	menu.innerHTML = `<p>${text}</p>`;
	choices.forEach(choice => {
		const btn = document.createElement("button");
		btn.textContent = choice;
		btn.onclick = () => {
			menu.style.display = "none";
			callback(choice);
		};
		menu.appendChild(btn);
	});
	menu.style.display = "block";
}

document.getElementById("modal-bg").onclick = closeAllModals;

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		closeAllModals();
	}
});
function closeAllModals() {
	document.getElementById("modal-bg").style.display = "none";
	document.getElementById("status-screen").style.display = "none";
	document.getElementById("levelup-menu").style.display = "none";
	document.getElementById("learn-skill-menu").style.display = "none";
	document.getElementById("inventory-menu").style.display = "none";
	document.getElementById("questLog").style.display = "none";
	document.getElementById("skill-menu").style.display = "none";
}

function initGame() {
	console.log("初期化開始！");
	player = {
		// ← let を外すことでグローバル変数を上書き！
		name: "勇者",
		level: 1,
		hp: 30,
		maxHp: 30,
		mp: 10,
		maxMp: 10,
		attack: 5,
		attackBonus: 0,
		defense: 2,
		defenseBonus: 0,
		speed: 2,
		speedBonus: 0,
		crit: 0,
		critBonus: 0,
		accuracy: 100,
		accuracyBonus: 0,
		recovery: 1,
		recoveryBonus: 0,
		exp: 0,
		nextExp: 10,
		sp: 0,
		skills: [],
		potions: 1,
		weapon: null,
		armor: null,
		x: 0,
		y: 0,
		inventory: {
			weapons: [],
			armors: []
		},
		quests: {}, // ← 空でOK！initializeQuests() が埋めてくれる！
		questStarted: false,
		questCompleted: false,
		slimeDefeated: 0,
		hasActedThisTurn: false
	};
	initializeQuests(); // ← questList に基づいてクエストを補完！
	drawMap();
	updateStatus();
}

window.onload = () => {
	initGame();
	updateLog("🌄 冒険が始まった！")
};
