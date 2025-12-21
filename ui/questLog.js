import { player } from "../core/player.js";
import { questList } from "../data/quests.js";

export function renderQuestList() {
	const list = document.getElementById("questList");
	if (!list) return;
	list.innerHTML = "";

	for (const key in player.quests) {
		const quest = player.quests[key];
		const def = questList[key];
		if (!def) continue;

		let statusText = "";
		let statusClass = "";

		if (quest.completed) {
			statusText = "✅ 達成済み";
			statusClass = "quest-complete";
		} else if (quest.started) {
			statusText = `📘 進行中：${quest.progress}/${def.goal}`;
			statusClass = "quest-in-progress";
		} else {
			statusText = "🕓 未受注";
			statusClass = "quest-unstarted";
		}

		const entry = document.createElement("div");
		entry.classList.add("quest-entry", statusClass);
		entry.innerHTML = `
            <strong>${def.title}</strong><br>
            <small>${def.description}</small><br>
            <em>${statusText}</em>
            <hr>
        `;
		list.appendChild(entry);
	}
}

export function toggleQuestLog() {
	const log = document.getElementById("quest-log");
	const bg = document.getElementById("modal-bg");
	const isOpen = log.style.display === "block";

	log.style.display = isOpen ? "none" : "block";
	bg.style.display = isOpen ? "none" : "block";

	if (!isOpen) renderQuestList();
}

export function closeQuestLog() {
	document.getElementById("quest-log").style.display = "none";
	document.getElementById("modal-bg").style.display = "none";
}

export function setupQuestLogCloseButton() {
	const btn = document.querySelector("#quest-log .button");
	if (btn) {
		btn.addEventListener("click", closeQuestLog);
	}
}

export function setupQuestLogBackgroundClose() {
	const bg = document.getElementById("modal-bg");
	if (!bg) return;

	bg.addEventListener("click", () => {
		const log = document.getElementById("quest-log");
		if (log && log.style.display === "block") {
			closeQuestLog();
		}
	});
}

window.closeQuestLog = closeQuestLog;