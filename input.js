function pointerLocked() {
    return document.pointerLockElement !== null;
}   

function renderMode(opt = 1) {
    if (opt == 1) {
        mapVisible = false
        requestPointerLock()
    } else if (opt == 2) {
        mapVisible = true
        exitPointerLock()
    }
}

function getMapMouse() {
    let x = mouseX - mapOff.x
    let y = mouseY - mapOff.y
    if (mapZoomed) {
        x += (pl0.pos.x - mapWidth / 2) * cls
        y += (pl0.pos.y - mapHeight / 2) * cls
    }
    return { x, y };
}

function mouseOnMap() {
    let { x, y } = getMapMouse();
    return (
        mapVisible &&
        x > 0 && x < mapWidth * cls &&
        y > 0 && y < mapHeight * cls
    )
}

function mouseWheel(event) {
    let scroll = event.delta < 0
    if (scroll) cls *= 1.1
    else cls /= 1.1

    mapZoomed = cls * mapWidth > width || cls * mapHeight > height
    if (!mapZoomed) fitMap()

    mapOff = getMapOff()
    drawOff = getDrawMapOff()
    return false;
}

function setKeyNum(kc) {
    let kn = kc - 48
    if (kn < 0 || kn > wallTextures.length)
        placeTxtrNum = 0
    else
        placeTxtrNum = kn
}

function keyPressed() {
    setKeyNum(keyCode);

    if (keyCode == 70) {
        if (mapVisible) renderMode(1);
        else renderMode(2);
    }
}

function mousePressed() {
    pl0.aim = (mouseButton == RIGHT);
    if (mapVisible) {
        if (mouseOnMap()) {
            let { x, y } = getMapMouse();
            let cell = getCell(x, y);
            placeCell(worldMap, cell, placeTxtrNum)
        } else {
            renderMode(1)
        }
    } else if (viewVisible) {
        if (pointerLocked()) pl0.shoot()
        renderMode(1)
    }
}

document.oncontextmenu = () => false;

function mouseReleased() { pl0.aim = false; }

function mouseMoved() {
    if (pointerLocked()) pl0.rotate()
    // for testing
    if (mapVisible) {
        pl1.ang = 180 - degrees(atan2(
            pl1.pos.y * cls + drawOff.y - mouseY,
            pl1.pos.x * cls + drawOff.x - mouseX
        ))
        pl1.ang = normalAng(pl1.ang)
    }
}

function mouseDragged() {
    mouseMoved();
    if (!mapVisible) return;
    let { x, y } = getMapMouse();
    placeCell(worldMap, getCell(x, y), placeTxtrNum)
}