import { castSkill, enemyAttack, getCurrentEnemy, getInBattle } from "../core/battle.js";
import { getLearnedSkills } from "../core/skill.js";
import { player } from "../core/player.js";
import { updateStatus } from "../ui/status.js";
import { skillTree } from "../data/skills.js";

// 戦闘UI-スキルボタン押下時
function openSkillMenu() {
	const menu = document.getElementById("skill-tree-menu");
	const bg = document.getElementById("modal-bg");
	if (!menu || !bg) return;

	menu.innerHTML = "<h3>スキル</h3>";

	const skills = getLearnedSkills();
	const inBattle = getInBattle();

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
			btn.classList.add("button");

			// 🔍 クールダウン状態を取得
			const cd = player.skillCooldowns?.[skill.id] ?? 0;
			const isCooling = cd > 0;

			// 🔤 ボタンのラベルを変更
			const cdLabel = isCooling ? `（CD:${cd}）` : "";
			btn.textContent = `${skill.name}${cdLabel}（MP${skill.mpCost}） - ${skill.description}`;

			if (!inBattle) {
				btn.disabled = true;
				btn.classList.add("unavailable");
			} else if (isCooling) {
				// 🔒 クールダウン中：使用不可
				btn.disabled = true;
				btn.classList.add("unavailable");
				btn.title = `あと ${cd} ターンで使用可能`;
			} else if (player.mp < skill.mpCost) {
				btn.disabled = true;
				btn.classList.add("unavailable");
				btn.title = "MPが足りません";
			} else {
				// 使用可能
				btn.onclick = () => {
					closeSkillMenu();
					castSkill(skill.id);
					updateStatus();
					enemyAttack(getCurrentEnemy());
				};
			}

			menu.appendChild(btn);
		});

		if (!inBattle) {
			const note = document.createElement("p");
			note.textContent = "※ スキルは戦闘中のみ使用できます";
			note.style.fontSize = "0.9em";
			note.style.color = "#888";
			note.style.marginTop = "8px";
			menu.appendChild(note);
		}
	}

	// 閉じるボタン
	const close = document.createElement("button");
	close.textContent = "閉じる";
	close.classList.add("button");
	close.onclick = closeSkillMenu;
	menu.appendChild(close);

	menu.style.display = "block";
	bg.style.display = "block";
}

function closeSkillMenu() {
	document.getElementById("skill-tree-menu").style.display = "none";
	document.getElementById("modal-bg").style.display = "none";
}

export { openSkillMenu, closeSkillMenu };

// メニューUI-スキル一覧ボタン押下時
export function showAllSkillsMenu() {
	const menu = document.getElementById("all-skills-menu");
	const container = document.getElementById("all-skills-container");
	if (!menu || !container) return;

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
			node.className = "skill-node view-only";
			node.textContent = `${skill.name}（Lv${skill.requiredLevel} / SP${skill.cost}）`;
			node.title = skill.description;
			branchDiv.appendChild(node);
		});

		container.appendChild(branchDiv);
	}

	menu.style.display = "block";
	document.getElementById("modal-bg").style.display = "block";
}

export function closeAllSkillsMenu() {
	document.getElementById("all-skills-menu").style.display = "none";
	document.getElementById("modal-bg").style.display = "none";
}

window.closeAllSkillsMenu = closeAllSkillsMenu;


