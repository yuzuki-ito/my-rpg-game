// logMessages.js

// 敵の攻撃メッセージ
export function getEnemyAttackMessage(enemyName, damage) {
    const patterns = [
        `${enemyName} の攻撃！${damage} ダメージを受けた！`,
        `${enemyName} が体当たりしてきた！${damage} のダメージ！`,
        `${enemyName} の一撃！${damage} ダメージ！`,
        `${enemyName} の攻撃が命中！${damage} のダメージ！`
    ];
    return randomChoice(patterns);
}

// プレイヤーの攻撃メッセージ
export function getPlayerAttackMessage(enemyName, damage) {
    const patterns = [
        `あなたの攻撃！${enemyName} に ${damage} ダメージ！`,
        `${enemyName} に ${damage} のダメージを与えた！`,
        `${enemyName} は ${damage} のダメージを受けた！`,
        `鋭い一撃！${enemyName} に ${damage} ダメージ！`
    ];
    return randomChoice(patterns);
}

// クリティカルヒット
export function getCriticalHitMessage(enemyName, damage) {
    const patterns = [
        `⚡ クリティカルヒット！${enemyName} に ${damage} ダメージ！`,
        `💥 会心の一撃！${enemyName} に ${damage} の大ダメージ！`,
        `🔥 ${enemyName} に強烈な一撃！${damage} ダメージ！`,
        `⚔️ クリティカル！${enemyName} は ${damage} のダメージを受けた！`
    ];
    return randomChoice(patterns);
}

// 回避メッセージ
export function getDodgeMessage(attackerName, targetName) {
    const patterns = [
        `${targetName} は ${attackerName} の攻撃をひらりとかわした！`,
        `${attackerName} の攻撃を ${targetName} が見切った！`,
        `${attackerName} の攻撃は空を切った！`,
        `${targetName} は攻撃を回避した！`
    ];
    return randomChoice(patterns);
}

// ミス（命中失敗）
export function getMissMessage(attackerName) {
    const patterns = [
        `${attackerName} の攻撃は外れた！`,
        `${attackerName} は狙いを外した！`,
        `攻撃は当たらなかった…`,
        `${attackerName} の攻撃は届かなかった！`
    ];
    return randomChoice(patterns);
}

// 撃破メッセージ
export function getDefeatMessage(enemyName) {
    const patterns = [
        `🎉 ${enemyName} をたおした！`,
        `✨ ${enemyName} を撃破！`,
        `${enemyName} は力尽きた…`,
        `${enemyName} は倒れた！`
    ];
    return randomChoice(patterns);
}

// 回復メッセージ
export function getHealMessage(amount) {
    const patterns = [
        `💖 HPが ${amount} 回復した！`,
        `やすんで HP を ${amount} 回復！`,
        `癒しの力で ${amount} 回復！`,
        `ポーションで ${amount} 回復した！`
    ];
    return randomChoice(patterns);
}

// 汎用ランダム選択関数
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}
