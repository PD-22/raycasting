var width, height, mapHeight, mapWidth, cls, mapZoomed,
    rayBuf, fov, worldMap, mapVisible, viewVisible, mapOff, drawOff,
    ceilClr, floorClr, placeTxtrNum, pl0, pl1, logVisible,
    displayBuf, prevDisplayBuf, displayWidth, displayHeight, dScale,
    pixelCount, redraw, stopRender, stopDraw, mapRayNum, volume, ammo1;

let debugLogs = {};

function setup() {
    displayWidth = 160;
    displayHeight = 90;
    makeDisplayBuf();

    createMyCanvas()
    worldMap = makeMap(myMap);

    // worldMap = cellularMap(48, 48, 0.45, 8);

    pl0 = new Player(2.501, 4.501, 60.1, 4)
    // pl1 = new Player(16.502 - 4, 4.502+3, 0, 8)
    // Player.spawnMany(15, null, null, null, 8);
    // ammo1 = new Item(pl1.pos.x, pl1.pos.y - 2, ammo_64, 'ammo');
    // Item.spawnMany(4, ammo_64, 'ammo')

    mapZoomed = false
    fitMap()
    mapOff = getMapOff()
    drawOff = getDrawMapOff()

    fov = 90
    ceilClr = '#383838';
    floorClr = '#717171';
    placeTxtrNum = 0
    mapRayNum = 24;
    volume = getStoredVolume() ?? 5;

    redraw = stopRender = stopDraw = false;
    logVisible = false;
    mapVisible =
        // true
    false
    viewVisible =
        true
    // false

    wallTextures[2] = doorSide_64;
}

function draw() {
    myLog('cast', () => rayBuf = castRays(pl0.pos, pl0.ang));

    if (viewVisible) myLog('view', () => drawView(rayBuf));
    if (mapVisible) drawMap(rayBuf);
    if (logVisible) logStats();

    pl0.update([87, 65, 83, 68, 81, 69])
    Player.animateAll();

    // for testing
    pl1?.update([
        UP_ARROW,
        LEFT_ARROW,
        DOWN_ARROW,
        RIGHT_ARROW
    ])

    // log
    myLogMany({
        volume,
        ammoNum: pl0.ammoNum,
    })
}