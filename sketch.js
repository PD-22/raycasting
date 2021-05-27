// imitate old render

var width, height, mapHeight, mapWidth, cls, mapZoomed,
    rayBuf, fov, worldMap, mapVisible, viewVisible, mapOff, drawOff,
    ceilClr, floorClr, placeTxtrNum, pl0, pl1, logVisible,
    displayBuf, prevDisplayBuf, displayWidth, displayHeight, displayScale,
    pixelCount, redraw, stopRender

let timerLogs = {};

function setup() {
    displayWidth = 160 / 2;
    displayHeight = 90 / 2;
    makeDisplayBuf();

    createMyCanvas()
    background('gray')

    worldMap = makeMap(myMap);

    // worldMap = cellularMap(48, 48, 0.45, 8);
    // Player.spawnMany(5);

    pl0 = new Player(2 - 0.01, 4.5 - 0.01, 0, 0.75)
    pl1 = new Player(3.5, 4.5, 180 - 0)
    Player.spawnMany(5);
    fov = 90
    mapZoomed = false
    fitMap()
    mapOff = getMapOff()
    drawOff = getDrawMapOff()
    ceilClr = rgbToHex([173, 216, 230]);
    floorClr = rgbToHex([144, 238, 144]);
    placeTxtrNum = 0

    redraw = stopRender = false;

    mapVisible = false;
    logVisible = true;
    viewVisible = true;
}


function draw() {
    rayBuf = castRays(pl0.pos, pl0.ang)

    if (viewVisible) drawView(rayBuf);
    if (mapVisible) drawMap(rayBuf);
    if (logVisible) logStats();

    pl0.update([87, 65, 83, 68, 81, 69])
    Player.animateAll();

    // for testing
    pl1.update([
        UP_ARROW,
        LEFT_ARROW,
        DOWN_ARROW,
        RIGHT_ARROW
    ])
}

function logStats() {
    push();
    noStroke();
    fill(0);
    timerLogs['FPS'] = Math.round(1000 / deltaTime);
    timerLogs['PPF'] = pixelCount;
    let logs = Object.entries(timerLogs).reverse();
    let logWidth = 90;
    rect(0, 0, logWidth, logs.length * 20 + 10);
    logs.forEach(([key, val], i) => {
        fill('white');
        text(`${key}: ${Math.round(val.toFixed(3))}`, 10, (i + 1) * 20);
        if (['FPS', 'PPF'].some(e => e == key)) return;

        if (val < 1000 / 60)
            fill(0, 255, 0, 200);
        else if (val < 2 * 1000 / 60)
            fill(255, 255, 0, 200);
        else
            fill(255, 0, 0, 200);
        rect(0, i * 20, val % logWidth, 20);
    });
    pop();
}

function time(name, callback) {
    let start = Date.now();
    callback();
    let end = Date.now() - start;
    timerLogs[name] = end;
}

function createMyCanvas() {
    displayScale = Math.floor(window.innerWidth / displayWidth);
    width = displayWidth * displayScale;
    height = width / 16 * 9;
    if (height > window.innerHeight) {
        displayScale = Math.floor(window.innerHeight / displayHeight);
        height = displayHeight * displayScale;
        width = height * 16 / 9;
    }
    createCanvas(width, height)
}