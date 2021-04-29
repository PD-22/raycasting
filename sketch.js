let width, height, cls, ratio, mapZoomed, fov, renderMap,
    renderView, mx, my, ceilClr, floorClr, placeTxtrNum, pl0, pl1

export { pl0, fov, cls, mapOff, ceilClr, floorClr };

import Player from "./Player.js";
import Bullet from "./Bullet.js";
import { normalAng } from "./angles.js";
import { map, setMap, wallTextures } from "./data.js";
import { castRays, rayBuff } from "./rayCasting.js";
import { getCell, copyMatrix, mRows, mCols, makeMatrix, placeCell }
    from "./Matrix.js";
import { cellularAutomata, countWallNeighbors }
    from "./cellAutomata.js";
import {
    res, setRes, fitMap, drawView, drawMap, drawMatrix, drawCell,
    mapOff, drawOff, setDrawMapOff, setMapOff
} from "./render.js";

window.setup = function () {
    createMyCanvas();
    background('gray');

    // setMap(cellularAutomata(makeMatrix(48, 48, 0.45), 8))

    pl0 = new Player(6.5, 2.5, 0)
    pl1 = new Player(8.5, 3.5, 180 - 30)
    Player.spawnMany(5);
    fov = 90
    setRes(width / 4);
    mapZoomed = false;
    cls = fitMap()
    setMapOff()
    setDrawMapOff()
    ceilClr = 'lightBlue'
    floorClr = 'lightGreen'
    placeTxtrNum = 0

    renderMap = true
    renderView = true
}


window.draw = function () {
    background(127);
    castRays(pl0.pos, pl0.ang, res)
    if (renderView) drawView(pl0.pos, rayBuff)
    if (renderMap) drawMap(pl0.pos, rayBuff)
    if (!pl0.alive) { fill(0, 127); rect(0, 0, width, height) }
    pl0.move(87, 65, 83, 68)
    pl1.move(UP_ARROW, LEFT_ARROW, DOWN_ARROW, RIGHT_ARROW) // for testings
    Bullet.updateAll();
}


// Input functions

window.mouseWheel = function (event) {
    let scroll = event.delta < 0
    if (scroll) cls *= 1.1
    else cls /= 1.1

    mapZoomed = cls * mCols > width || cls * mRows > height
    if (!mapZoomed) cls = fitMap()

    setMapOff()
    setDrawMapOff()
    return false;
}

window.keyPressed = function (e) {
    setKeyNum(keyCode)

    if (keyCode == 70) {
        if (renderMap) {
            renderMode(1)
        } else {
            renderMode(2)
        }
    }
}

window.mousePressed = function () {
    pl0.aim = (mouseButton == RIGHT);
    if (renderMap) {
        if (mouseOnMap()) {
            updateMouse()
            let cell = getCell(mx, my)
            placeCell(map, cell, placeTxtrNum)
        } else {
            renderMode(1)
        }
    } else if (renderView) {
        if (pointerLocked()) pl0.shoot()
        renderMode(1)
    }
}

document.oncontextmenu = () => false;

window.mouseReleased = function () { pl0.aim = false; }

window.mouseMoved = function () {
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

window.mouseDragged = function () {
    mouseMoved();
    if (renderMap)
        placeCell(map, getCell(mx, my), placeTxtrNum)
}


// other functions

function createMyCanvas() {
    ratio = window.screen.height / window.screen.width
    width = window.innerWidth
    height = width * ratio
    if (height > window.innerHeight) {
        height = window.innerHeight
        width = height / ratio
    }
    createCanvas(width, height)
}

function mouseOnMap() {
    return (
        renderMap &&
        mx > 0 && mx < mCols * cls &&
        my > 0 && my < mRows * cls
    )
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
        mx += (pl0.pos.x - mCols / 2) * cls
        my += (pl0.pos.y - mRows / 2) * cls
    }
}

function setKeyNum(kc) {
    let kn = kc - 48
    if (kn < 0 || kn > wallTextures.length) {
        placeTxtrNum = 0
    } else {
        placeTxtrNum = kn
    }
}

function pointerLocked() {
    return document.pointerLockElement !== null;
}