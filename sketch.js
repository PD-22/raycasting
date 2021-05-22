let width, height, mapHeight, mapWidth, cls, ratio, mapZoomed,
    rayBuf, fov, worldMap, renderMap, renderView, mapOff, drawOff,
    mx, my, ceilClr, floorClr, placeTxtrNum, pl0, pl1,
    displayBuf, prevDisplayBuf, displayWidth, displayHeight, displayScale,
    stopRender = false // temp

function setup() {
    displayWidth = 160;
    displayHeight = Math.floor(displayWidth * 9 / 16);
    displayBuf = new Uint8ClampedArray(
        displayWidth * displayHeight * 3
    );

    createMyCanvas()
    background('gray')

    worldMap = makeMap(myMap);

    // worldMap = cellularMap(48, 48, 0.45, 8);
    // Player.spawnMany(5);

    pl0 = new Player(7 - 0.01, 3.5 - 0.01, 0)
    pl1 = new Player(8.5, 3.5, 180 - 30)
    Player.spawnMany(5);
    fov = 90
    mapZoomed = false
    fitMap()
    mapOff = getMapOff()
    drawOff = getDrawMapOff()
    ceilClr = rgbToHex([173, 216, 230]);
    floorClr = rgbToHex([144, 238, 144]);
    placeTxtrNum = 0

    renderMap = false
    renderView = true
}


function draw() {
    rayBuf = castRays(pl0.pos, pl0.ang)
    if (renderView) drawView(rayBuf);
    if (renderMap) drawMap(rayBuf);
    if (!pl0.alive) {
        fill(0, 127);
        rect(0, 0, width, height);
    }
    pl0.update([87, 65, 83, 68])
    pl1.update([
        UP_ARROW,
        LEFT_ARROW,
        DOWN_ARROW,
        RIGHT_ARROW
    ]) // for testing

    // debugging
    push();
    fill(0);
    rect(0, 0, 80, 55);
    fill('white');
    text(`FPS: ${Math.round(1000 / deltaTime)}`, 10, 20);
    text(`PPF: ${pixelCount}`, 10, 45);
    pop();
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