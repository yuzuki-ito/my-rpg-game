import { updateLog } from "./log.js";
import { toggleStatus } from "./status.js";
import { showStatUpgradeMenu } from "./statUpgradeMenu.js";
import { showLearnSkillMenu } from "./learnSkillMenu.js";
import { showAllSkillsMenu } from "../ui/skillMenu.js"
import { showInventoryMenu } from "./inventoryMenu.js";
import { toggleQuestLog } from "./questLog.js";
import { saveGame } from "../core/save.js";
import { loadGame } from "../core/save.js";

// メニュー開閉用
export function setupMenuToggle() {
    const toggleBtn = document.getElementById("menu-button");
    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", toggleMenu);
}

function toggleMenu() {
    const menu = document.getElementById("extra-menu");
    const toggleBtn = document.getElementById("menu-button");
    const isOpen = getComputedStyle(menu).display === "flex";

    menu.style.display = isOpen ? "none" : "flex";
    toggleBtn.textContent = isOpen ? "📂 メニュー" : "📂 閉じる";
}

// メニュー表示後の各種ボタン押下処理
export function setupMenuButtons() {
    const buttons = document.querySelectorAll("button[data-menu]");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const menu = btn.getAttribute("data-menu");

            switch (menu) {
                case "status":
                    toggleStatus();
                    break;
                case "stat-upgrade":
                    showStatUpgradeMenu();
                    break;
                case "learn-skill": //スキル習得
                    showLearnSkillMenu();
                    break;
                case "skill-tree": // 習得状況に関係なく全スキル表示
                    showAllSkillsMenu();
                    break;
                case "inventory":
                    showInventoryMenu();
                    break;
                case "quest-log":
                    toggleQuestLog();
                    break;
                case "save":
                    saveGame()
                    break;
                case "load":
                    loadGame()
                    break;
                default:
                    updateLog(`❓ 未対応のメニュー: ${menu}`);
            }
        });
    });
}

