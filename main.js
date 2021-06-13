// fix audio server dependance
// fix not blocking sprite

var width, height, mapHeight, mapWidth, cls, mapZoomed,
    rayBuf, fov, worldMap, mapVisible, viewVisible, mapOff, drawOff,
    ceilClr, floorClr, placeTxtrNum, pl0, pl1, logVisible,
    displayBuf, prevDisplayBuf, displayWidth, displayHeight, dScale,
    pixelCount, redraw, stopRender, stopDraw, mapRayNum, volume;

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
    ceilClr = '#383838';
    floorClr = '#717171';
    placeTxtrNum = 0
    mapRayNum = 5;
    volume = 5;

    redraw = stopRender = stopDraw = false;

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