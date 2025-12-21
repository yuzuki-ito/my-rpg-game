import { updateLog } from "./log.js";
import { updateStatus } from "./status.js";
import { player } from "../core/player.js";
import { canLearnSkill } from "../core/skill.js";
import { skillTree } from "../data/skills.js";
console.log("skillTree:", skillTree);

// スキル習得画面
export function showLearnSkillMenu() {
	const menu = document.getElementById("learn-skill-menu");
	const bg = document.getElementById("modal-bg");
	if (!menu || !bg) return;

	menu.innerHTML = "";
	const header = document.createElement("h3");
	header.textContent = `✨ スキル習得（残りSP: ${player.skills.points}）`;
	menu.appendChild(header);

	let anyAvailable = false;

	for (const branchKey in skillTree) {
		const branch = skillTree[branchKey];
		console.log("Checking branch:", branch.name);

		// 習得可能なスキルだけを抽出
		const availableSkills = branch.skills.filter(skill => isSkillVisible(skill));

		if (availableSkills.length === 0) continue; // このブランチに表示するスキルがなければスキップ

		anyAvailable = true;

		const branchTitle = document.createElement("h4");
		branchTitle.textContent = branch.name;
		menu.appendChild(branchTitle);

		availableSkills.forEach(skill => {
			const btn = document.createElement("button");
			btn.classList.add("button");
			btn.textContent = `${skill.name}（Lv${skill.requiredLevel} / SP${skill.cost}） - ${skill.description}`;

			if (canLearnSkill(skill)) {
				btn.onclick = () => {
					player.skills.learned.push(skill.id);
					player.skills.points -= skill.cost;
					updateLog(`🧠 新しいスキル『${skill.name}』を習得した！（SP -${skill.cost}）`, "skill");
					updateStatus();
					showLearnSkillMenu(); // 再描画
				};
			} else {
				btn.disabled = true;
				btn.classList.add("unavailable");
			}

			menu.appendChild(btn);
		});
	}

	if (!anyAvailable) {
		const msg = document.createElement("p");
		msg.textContent = "習得可能なスキルはありません。";
		menu.appendChild(msg);
	}

	const close = document.createElement("button");
	close.textContent = "閉じる";
	close.classList.add("button");
	close.onclick = () => {
		menu.style.display = "none";
		bg.style.display = "none";
	};
	menu.appendChild(close);

	menu.style.display = "block";
	bg.style.display = "block";
}

// 表示用の条件関数
export function isSkillVisible(skill) {
	// 習得済みなら非表示
	if (player.skills.learned.includes(skill.id)) return false;

	// レベルが足りてないなら非表示
	if (player.level < skill.requiredLevel) return false;

	// 前提スキルがあるなら、それを持ってるか確認
	if (skill.requires && !player.skills.learned.includes(skill.requires)) return false;

	return true;
}

export function setupLearnSkillCloseButton() {
	const screen = document.getElementById("learn-skill-menu");
	const btn = screen?.querySelector("button.button");
	if (btn) {
		btn.addEventListener("click", () => {
			screen.style.display = "none";
			document.getElementById("modal-bg").style.display = "none";
		});
	}
}
