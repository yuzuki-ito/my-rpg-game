function registerModalCloseHandler() {
	const bg = document.getElementById("modal-bg");
	if (!bg) return;

	// 二重登録を防ぐために一度だけ登録
	if (!bg.dataset.listenerAttached) {
		bg.addEventListener("click", () => {
			closeSkillTreeMenu();
			closeEquipMenu?.(); // 他のモーダルがあればここで閉じる
			// 他にも必要なら追加
		});
		bg.dataset.listenerAttached = "true";
	}
}
