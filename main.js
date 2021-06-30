// fix between doors
// add mobile control
// respond collision only on pl0

var width, height, mapHeight, mapWidth, cls, mapZoomed,
    rayBuf, fov, worldMap, mapVisible, viewVisible, mapOff, drawOff,
    ceilClr, floorClr, placeTxtrNum, pl0, pl1, logVisible,
    displayBuf, prevDisplayBuf, displayWidth, displayHeight, pxSize,
    pixelCount, redraw, stopRender, stopDraw, animDoorList, maxpxSize,
    mapRayNum, volume, ammo1, entDoorSide, playingAudioList;

let debugLogs = {};

function setup() {
    maxpxSize = 8;

    displayWidth = 160 / 5 * 4;
    displayHeight = 90 / 5 * 4;
    makeDisplayBuf();

    createMyCanvas()
    worldMap = makeMap(myMap);
    animDoorList = [];

    // worldMap = cellularMap(48, 48, 0.45, 8);

    // pl0 = new Player(4.01, 5.01, 100.1, 4)
    pl0 = new Player(8.51, 5.51, 155.01, 8)
    pl0.tool = 1;
    pl1 = new Player(7.51, 5.01, -30, 8)
    Player.spawnMany(5, null, null, null, 8);
    ammo1 = new Item(pl1.pos.x, pl1.pos.y - 2, ammo_64, 'ammo');
    Item.spawnMany(2, ammo_64, 'ammo')

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
    logVisible =
        // true
        false
    mapVisible =
        // true
        false
    viewVisible =
        true
    // false
}

function draw() {
    myLog('cast', () => rayBuf = castRays(pl0.pos, pl0.ang));

    myLog('pall', playingAudioList.length);
    myLog('entDoor', entDoorSide);

    if (viewVisible) myLog('view', () => drawView(rayBuf));
    if (mapVisible) drawMap(rayBuf);
    if (logVisible) logStats();

    pl0.update([87, 65, 83, 68, 81, 69])
    Player.animateAll();
    animDoors();
    updateAudio();

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