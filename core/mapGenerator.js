// mapGenerator.js
import { TILE_INFO } from "../data/tileTypes.js";

// 出現率調整
function getRandomTileIcon() {
    const entries = Object.entries(TILE_INFO).filter(
        ([icon, info]) =>
            info.passable !== false &&
            icon !== "🏠" &&
            icon !== "👹" &&
            icon !== "🏡" &&
            icon !== "🌳" // ← これを追加！
    );
    const weighted = entries.flatMap(([icon, info]) => {
        const weight = info.weight ?? 1;
        return Array(weight).fill(icon);
    });
    return weighted[Math.floor(Math.random() * weighted.length)];
}

// 地形のランダム生成
export function generateRandomMap(width, height) {
    const map = [];
    for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
            row.push(getRandomTileIcon());
        }
        map.push(row);
    }
    return map;
}

// 村とボスのランダム配置 mapは直接変更される
export function placeSpecialTiles(map, villageCount = 0, placeBoss = true, used = []) {
    const villagePositions = [];

    for (let i = 0; i < villageCount; i++) {
        const pos = getRandomUnusedPassableTile(map, used);
        map[pos.y][pos.x] = "🏠";
        villagePositions.push(pos);
    }

    let bossPos = null;
    if (placeBoss) {
        bossPos = getRandomUnusedPassableTile(map, used);
        map[bossPos.y][bossPos.x] = "👹";
    }

    return {
        map,
        villagePosList: villagePositions,
        bossPos
    };
}

function getRandomPassableTile(map) {
    const height = map.length;
    const width = map[0].length;
    let x, y;
    do {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
    } while (!TILE_INFO[map[y][x]]?.passable || map[y][x] === "👹" || map[y][x] === "🏠");
    return { x, y };
}

// 村タイルの位置を取得する関数
function findVillageTiles(map) {
    const positions = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "🏠") {
                positions.push({ x, y });
            }
        }
    }
    return positions;
}

// 村人を村タイルに割り当てる関数
export function assignVillagersToVillages(map, villagers) {
    const villageTiles = findVillageTiles(map);

    villagers.forEach((villager, index) => {
        const pos = villageTiles[index % villageTiles.length]; // 村が足りない場合はループ
        villager.location = { x: pos.x, y: pos.y, mapId: "main" };// ← これを追加！
    });
}

// 統合してマップ生成
export function generateFullMap(width, height, villagersInput, placeBoss = true, player) {
    const villagers = Array.isArray(villagersInput) ? villagersInput : Object.values(villagersInput);

    let map = generateRandomMap(width, height);

    const villageCount = villagers.length;

    // 使用済み座標を記録
    const used = [];

    // 村とボスを配置（used を渡すように変更）
    const { map: withSpecials } = placeSpecialTiles(map, villageCount, placeBoss, used);

    // 🌳 深い森の入口を1つだけ配置
    const forestEntrance = getRandomUnusedPassableTile(withSpecials, used);
    withSpecials[forestEntrance.y][forestEntrance.x] = "🌳";

    // 村人を村に割り当て
    assignVillagersToVillages(withSpecials, villagers);

    // 村人アイコンを配置
    console.log("現在位置:", player.location);
    villagers.forEach(v => {
        console.log(`${v.name} の位置:`, v.location);
        console.log("一致？", isSamePosition(v.location, player.location));
    });
    return withSpecials;
}

function getRandomUnusedPassableTile(map, usedPositions) {
    const height = map.length;
    const width = map[0].length;
    let x, y;
    let tries = 0;
    do {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
        tries++;
        if (tries > 1000) throw new Error("No valid tile found for placement.");
    } while (
        !TILE_INFO[map[y][x]]?.passable ||
        map[y][x] === "👹" ||
        map[y][x] === "🏠" ||
        usedPositions.some(pos => pos.x === x && pos.y === y)
    );
    usedPositions.push({ x, y });
    return { x, y };
}

// ボスマップ生成
export function generateDeepForestMap(width, height) {
    const map = generateRandomMap(width, height);
    const used = [];

    // 👹 ボスをランダム配置
    const bossPos = getRandomUnusedPassableTile(map, used);
    map[bossPos.y][bossPos.x] = "👹";

    // 🏡 メインマップへの入口を端に1つ配置
    const edgeTiles = [];

    for (let x = 0; x < width; x++) {
        edgeTiles.push({ x, y: 0 }); // 上端
        edgeTiles.push({ x, y: height - 1 }); // 下端
    }
    for (let y = 1; y < height - 1; y++) {
        edgeTiles.push({ x: 0, y }); // 左端
        edgeTiles.push({ x: width - 1, y }); // 右端
    }

    // 通行可能な端タイルだけに絞る
    const validEdges = edgeTiles.filter(({ x, y }) => {
        const tile = map[y][x];
        const alreadyUsed = used.some(pos => pos.x === x && pos.y === y);
        return TILE_INFO[tile]?.passable && tile !== "👹" && !alreadyUsed;
    });

    if (validEdges.length === 0) throw new Error("No valid edge tile for 🏡");

    const entrance = validEdges[Math.floor(Math.random() * validEdges.length)];
    map[entrance.y][entrance.x] = "🏡";

    return map;
}

// 位置比較を「値ベース」で行う関数
function isSamePosition(a, b) {
    return Number(a.x) === Number(b.x) && Number(a.y) === Number(b.y);
}
