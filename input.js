function pointerLocked() {
    return document.pointerLockElement !== null;
}

function renderMode(opt = 1) {
    if (opt == 1) {
        renderMap = false
        requestPointerLock()
    } else if (opt == 2) {
        renderMap = true
        exitPointerLock()
    }
}

function updateMouse() {
    mx = mouseX - mapOff.x
    my = mouseY - mapOff.y
    if (mapZoomed) {
        mx += (pl0.pos.x - mapWidth / 2) * cls
        my += (pl0.pos.y - mapHeight / 2) * cls
    }
}

function mouseOnMap() {
    return (
        renderMap &&
        mx > 0 && mx < mapWidth * cls &&
        my > 0 && my < mapHeight * cls
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
    if (kn < 0 || kn > wallTextures.length) {
        placeTxtrNum = 0
    } else {
        placeTxtrNum = kn
    }
}

function keyPressed(e) {
    setKeyNum(keyCode)

    if (keyCode == 70) {
        if (renderMap) {
            renderMode(1)
        } else {
            renderMode(2)
        }
    }
}

function mousePressed() {
    pl0.aim = (mouseButton == RIGHT);
    if (renderMap) {
        if (mouseOnMap()) {
            updateMouse()
            let cell = getCell(mx, my)
            placeCell(worldMap, cell, placeTxtrNum)
        } else {
            renderMode(1)
        }
    } else if (renderView) {
        if (pointerLocked()) pl0.shoot()
        renderMode(1)
    }
}

document.oncontextmenu = () => false;

function mouseReleased() { pl0.aim = false; }

function mouseMoved() {
    updateMouse()
    if (pointerLocked()) pl0.rotate()
    // for testing
    if (renderMap) {
        pl1.ang = 180 - degrees(atan2(
            pl1.pos.y * cls + drawOff.y - mouseY,
            pl1.pos.x * cls + drawOff.x - mouseX
        ))
        pl1.ang = normalAng(pl1.ang)
    }
}

function mouseDragged() {
    mouseMoved();
    if (renderMap)
        placeCell(worldMap, getCell(mx, my), placeTxtrNum)
}