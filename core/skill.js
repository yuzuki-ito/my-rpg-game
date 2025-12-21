import { player } from "./player.js";
import { updateLog } from "../ui/log.js";
import { updateStatus } from "../ui/status.js";

// スキルツリーのデータ（外部からインポートされている前提）
import { skillTree } from "../data/skills.js";

// 習得済みスキルを取得
export function getLearnedSkills() {
	return Object.values(skillTree)
		.flatMap(branch => branch.skills || [])
		.filter(skill => player.skills.learned.includes(skill.id) && skill.effect);
}

// スキル習得条件チェック
export function canLearnSkill(skill) {
	// すでに習得済みなら不可
	if (player.skills.learned.includes(skill.id)) return false;

	// レベル不足
	if (player.level < skill.requiredLevel) return false;

	// スキルポイント不足
	if (player.skills.points < skill.cost) return false;

	// 前提スキルが必要な場合
	if (skill.requires) {
		if (!player.skills.learned.includes(skill.requires)) return false;
	}

	return true;
}

// スキル習得処理
export function learnSkill(skillId) {
	const skill = findSkillById(skillId);
	if (!skill) {
		updateLog("❌ スキルが見つかりませんでした");
		return false;
	}
	if (!canLearnSkill(skill)) {
		updateLog("⚠️ このスキルはまだ習得できません");
		return false;
	}

	skill.learned = true;
	player.skills.points -= skill.cost;
	updateLog(`📘 スキル『${skill.name}』を習得した！`, "green");
	updateStatus();
	return true;
}

// スキル検索（再帰対応）
export function findSkillById(id) {
	for (const branch of Object.values(skillTree)) {
		const found = findSkillRecursive(branch.skills, id);
		if (found) return found;
	}
	return null;
}

function findSkillRecursive(skills, id) {
	for (const skill of skills) {
		if (skill.id === id) return skill;
		if (skill.subSkills) {
			const found = findSkillRecursive(skill.subSkills, id);
			if (found) return found;
		}
	}
	return null;
}

// スキルツリー表示（確認専用）
export function showSkillTreeMenu() {
	const container = document.getElementById("skill-tree-container");
	if (!container) {
		console.warn("⚠️ skill-tree-container が見つかりません！");
		return;
	}
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

			if (skill.learned) {
				node.classList.add("learned");
			} else if (canLearnSkill(skill)) {
				node.classList.add("available");
				node.addEventListener("click", () => {
					if (learnSkill(skill.id)) {
						showSkillTreeMenu(); // 再描画
					}
				});
			} else {
				node.classList.add("locked");
			}

			node.textContent = `${skill.name}（Lv${skill.requiredLevel} / SP${skill.cost}）`;
			node.title = skill.description;
			branchDiv.appendChild(node);
		});

		container.appendChild(branchDiv);
	}

	document.getElementById("skill-tree-menu").style.display = "block";
	document.getElementById("modal-bg").style.display = "block";
}

export function closeSkillTree() {
	const menu = document.getElementById("skill-tree-menu");
	const bg = document.getElementById("modal-bg");
	if (menu && bg) {
		menu.style.display = "none";
		bg.style.display = "none";
	}
}

// グローバルに公開（HTMLの onclick で使えるように）
window.closeSkillTree = closeSkillTree;
// グローバル公開（開発用 or UIボタン用）
window.showSkillTreeMenu = showSkillTreeMenu;
