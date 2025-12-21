let currentBGM = null;
let fadeDuration = 1000; // ミリ秒

function getBGMElements() {
	return {
		field: document.getElementById("bgm-field"),
		battle: document.getElementById("bgm-battle")
	};
}

export function playBGM(type) {
	// BGM再生を無効化
	console.log(`🔇 BGM「${type}」は再生されません（ミュート中）`);
}

export function stopBGM() {
	const bgms = getBGMElements();
	if (currentBGM && bgms[currentBGM]) {
		fadeOut(bgms[currentBGM], fadeDuration);
		currentBGM = null;
	}
}

export function setBGMVolume(volume) {
	const bgms = getBGMElements();
	for (const key in bgms) {
		if (bgms[key]) {
			bgms[key].volume = volume;
		}
	}
}

function fadeOut(audio, duration) {
	const steps = 20;
	const step = audio.volume / steps;
	const interval = duration / steps;

	const fade = setInterval(() => {
		if (audio.volume > step) {
			audio.volume -= step;
		} else {
			audio.volume = 0;
			audio.pause();
			clearInterval(fade);
		}
	}, interval);
}

function fadeIn(audio, duration) {
	const steps = 20;
	const step = 1 / steps;
	const interval = duration / steps;

	audio.volume = 0;
	const fade = setInterval(() => {
		if (audio.volume < 1 - step) {
			audio.volume += step;
		} else {
			audio.volume = 1;
			clearInterval(fade);
		}
	}, interval);
}
