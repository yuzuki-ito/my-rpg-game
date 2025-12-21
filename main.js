import { initGame } from "./core/player.js";
import { updateLog } from "./ui/log.js";
import { closeAllModals } from "./ui/ui.js";
import { playBGM } from "./core/audio.js";
import { move } from "./core/map.js";
import { GameState, setGameState, isGameState } from "./core/state.js";
import { setupBattleActionButtons } from "./ui/battleUI.js";
import { setupMenuToggle } from "./ui/menuUI.js";
import { setupMenuButtons } from "./ui/menuUI.js";
import { setupQuestLogBackgroundClose } from "./ui/questLog.js";

// グローバルに公開
import { setupStatusCloseButton } from "./ui/status.js";
setupStatusCloseButton();
import { setupLearnSkillCloseButton } from "./ui/learnSkillMenu.js";
setupLearnSkillCloseButton();
import { setupInventoryCloseButton } from "./ui/inventoryMenu.js";
setupInventoryCloseButton();
import { setupQuestLogCloseButton } from "./ui/questLog.js";
setupQuestLogCloseButton();


function startGame() {
	initGame();
	updateLog("🌄 冒険が始まった！");
	playBGM("field");
	setGameState(GameState.EXPLORING);
}

function setupKeyboardShortcuts() {
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") {
			closeAllModals();
			setGameState(GameState.EXPLORING);
			return;
		}

		if (!isGameState(GameState.EXPLORING)) return;

		switch (e.key) {
			case "w":
			case "ArrowUp":
				move("up");
				break;
			case "s":
			case "ArrowDown":
				move("down");
				break;
			case "a":
			case "ArrowLeft":
				move("left");
				break;
			case "d":
			case "ArrowRight":
				move("right");
				break;
		}
	});
}

// 移動ボタンのイベント設定
function setupMoveButtons() {
	const moveButtons = document.querySelectorAll("button[data-move]");
	moveButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			const direction = btn.getAttribute("data-move");
			move(direction);
		});
	});
}

document.addEventListener("DOMContentLoaded", () => {
	startGame();
	setupKeyboardShortcuts();
	setupMoveButtons();
	setupBattleActionButtons();
	setupMenuToggle();
	setupMenuButtons();
	setupQuestLogBackgroundClose();
});
