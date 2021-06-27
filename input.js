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
    let zoomDir = event.deltaY < 0
    if (zoomDir) cls *= 1.1
    else cls /= 1.1

    mapZoomed = cls * mapWidth > width || cls * mapHeight > height
    if (!mapZoomed) fitMap()

    mapOff = getMapOff()
    drawOff = getDrawMapOff()

    redraw = true;
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
    if (keyCode == 189) {
        volume = max(0, volume - 1);

        // temp
        worldMap[3][3] = max(doorVal, worldMap[3][3] - 0.1);
        
        sessionStorage.setItem('volume', volume);
    }
    if (keyCode == 187) {
        volume = min(10, volume + 1);
        // temp
        worldMap[3][3] = min(doorVal + 0.99, worldMap[3][3] + 0.1);

        sessionStorage.setItem('volume', volume);
    }

    if (keyCode == 32) pl0.shoot();

    if (keyCode == 70) {
        redraw = mapVisible;
        mapVisible = !mapVisible;
    }

    if (keyCode == 71) {
        redraw = logVisible;
        logVisible = !logVisible;
    }
}

function mousePressed() {
    if (mapVisible) {
        if (mouseOnMap()) {
            let { x, y } = getMapMouse();
            let cell = getCell(x, y);
            placeCell(worldMap, cell, placeTxtrNum)
        } else {
            mapVisible = false
            lockPointer();
        }
    } else if (viewVisible) {
        if (pointerLocked()) {
            if (buttonIsDown(LEFT)) pl0.shoot();
        }
        lockPointer();
    }
}

document.oncontextmenu = () => false;

function mouseMoved() {
    if (pointerLocked()) {
        let amount = movedX;
        if (buttonIsDown(RIGHT)) amount /= 4;
        pl0.rotate(amount);
    }
    // for testing
    if (mapVisible && pl1 != undefined) {
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