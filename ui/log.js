// ====== ログカラー定義 ======
const logColors = {
	default: "black",
	info: "blue",
	success: "green",
	warning: "orange",
	error: "red",
	quest: "gold",
	skill: "purple",
	battle: "cyan",
	item: "lime",
	enemy: "crimson"
};

// 最大ログ件数
const MAX_LOG_ENTRIES = 50;

// タイムスタンプ表示（必要なら true に）
const ENABLE_TIMESTAMP = false;

// ====== ログ出力 ======
export function updateLog(message, type = "default") {
	const logBox = document.getElementById("log");
	if (!logBox) return;

	const entry = document.createElement("div");
	entry.className = "log-entry";

	// タイムスタンプ付きメッセージ
	const time = ENABLE_TIMESTAMP ? `[${getTimeStamp()}] ` : "";
	entry.innerText = `${time}${message}`;

	console.log("message:", message, "type:", type);

	// カラー設定
	entry.style.color = logColors[type] || logColors.default;

	// クラスで色分け
	//entry.classList.add(`log-${type}`);

	logBox.appendChild(entry);

	// 古いログを削除
	while (logBox.children.length > MAX_LOG_ENTRIES) {
		logBox.removeChild(logBox.firstChild);
	}

	// 自動スクロール
	logBox.scrollTop = logBox.scrollHeight;
}

// ====== ログのクリア ======
export function clearLog() {
	const logBox = document.getElementById("log");
	if (logBox) logBox.innerHTML = "";
}

// ====== タイムスタンプ生成（00:00形式） ======
function getTimeStamp() {
	const now = new Date();
	const hh = now.getHours().toString().padStart(2, "0");
	const mm = now.getMinutes().toString().padStart(2, "0");
	return `${hh}:${mm}`;
}
