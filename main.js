// add health points
// fix rotate lag in mob

var width, height, mapHeight, mapWidth, cls, mapZoomed,
    rayBuf, fov, worldMap, mapOff, drawOff, devicePixelRatio,
    mapVisible, viewVisible, touchVisible, logVisible,
    ceilClr, floorClr, placeTxtrNum, pl0, pl1, pageWidth, pageHeight,
    displayBuf, prevDisplayBuf, displayWidth, displayHeight, pxlSize,
    pixelCount, redraw, stopRender, stopDraw, animDoorList, maxPxlSize,
    mapRayNum, volume, ammo1, entDoorSide, playingAudioList;

let debugLogs = {};

function setup() {
    maxPxlSize = 8;

    pageWidth = window.innerWidth;
    pageHeight = window.innerHeight;

    let { devicePixelRatio } = window;
    if (devicePixelRatio > 1) {
        displayWidth = 160 / 10 * 5;
        displayHeight = 90 / 10 * 5;
    } else {
        displayWidth = 160 / 5 * 4;
        displayHeight = 90 / 5 * 4;
    }

    makeDisplayBuf();
    createMyCanvas()
    worldMap = makeMap(myMap);
    animDoorList = [];

    // worldMap = cellularMap(48, 48, 0.45, 8);

    pl0 = new Player(myId, undefined, undefined, undefined, 8);
    emitMyPlayer();
    // pl1 = new Player(7.51, 5.01, -30, 8)
    // Player.spawnMany(5, null, null, null, 8);
    // ammo1 = new Item(pl1.pos.x, pl1.pos.y - 2, ammo_64, 'ammo');
    // Item.spawnMany(2, ammo_64, 'ammo')

    mapZoomed = false
    fitMap()
    mapOff = getMapOff()
    drawOff = getDrawMapOff()
    fov = 90
    ceilClr = '#383838';
    floorClr = '#717171';
    placeTxtrNum = 0
    mapRayNum = 16;
    volume = getStoredVolume() ?? 5;

    redraw = stopRender = stopDraw = false;

    // forceMobFull = true;

    // logVisible = true
    // touchVisible = true
    // mapVisible = true
    viewVisible = true
}

function draw() {
    myLog('cast', () => rayBuf = castRays(pl0.pos, pl0.ang));

    myLog('pall', playingAudioList.length);
    myLog('entDoor', entDoorSide);

    if (viewVisible) myLog('view', () => drawView(rayBuf));
    if (mapVisible) drawMap(rayBuf);
    if (logVisible) logStats();
    if (touchVisible) drawTouch();

    pl0.updateVelocity([87, 65, 83, 68]);
    pl0.updateRotate([81, 69]);

    let drx = deltPosRight?.x ?? 0;
    drx *= pxlSize / devicePixelRatio / 8;
    pl0.rotate(drx * deltaTime * 0.06);
    if (deltPosRight?.x != undefined)
        deltPosRight.x = 0;

    let dlx, dly
    if (prevPosLeft != undefined && startPosLeft != undefined) {
        dlx = prevPosLeft.x - startPosLeft.x;
        dly = prevPosLeft.y - startPosLeft.y;
        let ang = Math.atan2(dly, dlx) - radians(pl0.ang + 90);
        ang = radians(normalAng(degrees(ang)));
        let mag = sqrt(dlx ** 2 + dly ** 2) / 200;
        let max = pl0.speed / 2;
        mag = min(max, mag);
        const scale = pxlSize / devicePixelRatio / 32;
        let velX = cos(ang) * mag * scale;
        let velY = sin(ang) * mag * scale;

        pl0.vel = { x: -velX, y: -velY };
        pl0.dir = { x: dlx, y: dly };

        myLog('velX', velX * 1000);
        myLog('velY', velY * 1000);
        myLog('ang', degrees(ang));
        myLog('mag', mag * 1000);
    }

    if (keyIsDown(SHIFT)) {
        pl0.vel.x *= 1.75
        pl0.vel.y *= 1.75
    }
    pl0.updatePosition();
    pl0.respondToCollision();

    Player.animateAll();
    emitMyPlayer();

    animDoors();
    updateAudio();

    // for testing
    // pl1.updateVelocity([
    //     UP_ARROW,
    //     undefined,
    //     DOWN_ARROW,
    //     undefined
    // ])
    // pl1.updateRotate([
    //     LEFT_ARROW,
    //     RIGHT_ARROW
    // ])
    // pl1.updatePosition();
    // pl1.respondToCollision();

    // log
    myLogMany({
        volume,
        ammoNum: pl0.ammoNum,
    })
}