/**
 * 選択肢付き会話の表示
 * @param {string} text - 表示するメッセージ
 * @param {string[]} choices - 選択肢の配列
 * @param {function} callback - 選択時に呼ばれる関数（引数に選ばれた文字列）
 */
export function showDialogue(text, choices, callback) {
	const box = document.getElementById("dialogue-box");
	if (!box) return;

	box.innerHTML = "";

	const message = document.createElement("p");
	message.textContent = text;
	box.appendChild(message);

	choices.forEach((choice, index) => {
		const btn = document.createElement("button");
		btn.textContent = choice;
		btn.classList.add("dialogue-choice");
		btn.setAttribute("data-choice-index", index);
		btn.onclick = () => {
			box.style.display = "none";
			callback(choice);
		};
		box.appendChild(btn);
	});

	box.style.display = "block";
}
