var width, height, mapHeight, mapWidth, cls, mapZoomed,
    rayBuf, fov, worldMap, mapVisible, viewVisible, mapOff, drawOff,
    ceilClr, floorClr, placeTxtrNum, pl0, pl1, logVisible,
    displayBuf, prevDisplayBuf, displayWidth, displayHeight, dScale,
    pixelCount, redraw, stopRender

let debugLogs = {};

function setup() {
    displayWidth = 160;
    displayHeight = 90;
    makeDisplayBuf();

    createMyCanvas()
    worldMap = makeMap(myMap);

    // worldMap = cellularMap(48, 48, 0.45, 8);

    pl0 = new Player(18.501, 3.501, 180)
    pl1 = new Player(16.502, 3.502, 0)
    Player.spawnMany(15);
    fov = 90
    mapZoomed = false
    fitMap()
    mapOff = getMapOff()
    drawOff = getDrawMapOff()
    ceilClr = [173, 216, 230];
    floorClr = [144, 238, 144];
    placeTxtrNum = 0

    redraw = stopRender = false;

    mapVisible = false;
    logVisible = false;
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
    fill(0, 200);
    debugLogs['FPS'] = Math.round(1000 / deltaTime);
    debugLogs['PPF'] = pixelCount;
    let logs = Object.entries(debugLogs).reverse();
    let logWidth = 90;
    rect(0, 0, logWidth, logs.length * 20 + 10);
    logs.forEach(([key, val], i) => {
        if (typeof val == 'number')
            val = Math.round(val.toFixed(2));
        fill('white');
        text(`${key}: ${val}`, 10, (i + 1) * 20);
        if (['FPS', 'PPF'].some(e => e == key)) return;

        if (val < 1000 / 60)
            fill(0, 255, 0, 200);
        else if (val < 2 * 1000 / 60)
            fill(255, 0, 0, 200);
        else
            fill(255, 255, 0, 200);
        rect(0, i * 20, val % logWidth, 20);
    });
    pop();
}

function time(name, callback) {
    let start = Date.now();
    callback();
    let end = Date.now() - start;
    debugLogs[name] = end;
}

function createMyCanvas() {
    dScale = Math.floor(window.innerWidth / displayWidth);
    width = displayWidth * dScale;
    height = width / 16 * 9;
    if (height > window.innerHeight) {
        dScale = Math.floor(window.innerHeight / displayHeight);
        height = displayHeight * dScale;
        width = height * 16 / 9;
    }
    createCanvas(width, height)
}