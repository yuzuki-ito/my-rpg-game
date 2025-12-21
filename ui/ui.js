import { showEnemyImage } from "./battleUI.js";
import { setInBattle, setCurrentEnemy } from "../core/battle.js";

// モーダルID一覧（HTMLのIDと一致させること！）
export const modalIds = [
	"status-screen",
	"stat-upgrade",
	"learn-skill-menu",
	"all-skills-menu",
	"skill-tree-menu",
	"inventory-menu",
	"quest-log"
];

// UIの初期化
export function resetUI() {
	closeAllModals();
	showEnemyImage(null);
	setInBattle(false);
	setCurrentEnemy(null);
}

// モーダルをすべて閉じる
export function closeAllModals() {
	modalIds.forEach(id => {
		const el = document.getElementById(id);
		if (el) el.style.display = "none";
	});
	const bg = document.getElementById("modal-bg");
	if (bg) bg.style.display = "none";
}

// モーダル背景クリックで閉じる
document.getElementById("modal-bg")?.addEventListener("click", closeAllModals);

// Escキーで閉じる
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		closeAllModals();
	}
});
