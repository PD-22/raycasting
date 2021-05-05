let width, height, map, mRows, mCols, cls, ratio, mapZoomed,
    fov, renderMap, renderView, mapOff, drawOff,
    mx, my, ceilClr, floorClr, wallTextures, placeTxtrNum, pl0, pl1

export {
    map, pl0, fov, mRows, cls, mCols, mapOff,
    ceilClr, floorClr, wallTextures
};

import {
    multClr, randomTextures, randomTexture, randomColor
} from "./textures.js";
import Sprite from "./Sprite.js";
import Player from "./Player.js";
import Bullet from "./Bullet.js";
import { getCell, getCellVal, makeMatrix, copyMatrix }
    from "./Matrix.js";
import { normalAng, angToDir } from "./angles.js";
import { res, drawView, calcColHeight, fitMap, getDrawMapOff, getMapOff }
    from "./render.js";
import { castRay, castRays, getTxtrOff, rayBuff } from "./rayCasting.js";

/*
pos int bug
fullscreen crashes (gray screen)
sprites have gaps (not walls)
separate files for classes
    make useful functions more global
moving to modules mode...
*/

window.setup = function () {
    createMyCanvas()
    background('gray')

    map = makeMap([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
        [1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 4, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1],
        [1, 0, 5, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ])

    wallTextures = randomTextures(10, 2)

    let c0 = randomColor()
    let c1 = multClr(c0, 0.2)
    Player.textures = [[
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, c0, c0, c0, c0, -1, -1],
        [-1, -1, c0, c0, c0, c0, -1, -1],
        [-1, -1, c1, c0, c0, c0, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, c0, c0, c0, c0, -1, -1],
    ], [
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, c0, c0, c0, c0, - 1, -1],
        [-1, c1, c0, c0, c0, c0, -1, -1],
        [-1, -1, -1, c0, c0, c0, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, c0, c0, c0, -1, -1, -1],
    ], [
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, c0, c0, c0, c0, - 1, -1],
        [-1, -1, c0, c0, c0, c0, c1, -1],
        [-1, -1, c0, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, c0, -1, -1],
    ], [
        [-1, -1, -1, c1, c1, -1, -1, -1],
        [-1, -1, -1, c1, c1, -1, -1, -1],
        [-1, -1, c1, c1, c1, c1, -1, -1],
        [-1, -1, c1, c1, c1, c1, -1, -1],
        [-1, -1, c1, c1, c1, c1, -1, -1],
        [-1, -1, -1, c1, c1, -1, -1, -1],
        [-1, -1, -1, c1, c1, -1, -1, -1],
        [-1, -1, c1, c1, c1, c1, -1, -1],
    ], [
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, - 1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, c1, c1, -1, -1, -1],
        [-1, -1, c1, c1, c1, c1, -1, -1],
    ]]

    // map = makeMap(0, 16, 16)

    // map = makeMap(
    //     cellularAutomata(
    //         makeMatrix(48, 48, 0.45), 8
    //     )
    // )

    pl0 = new Player(6.5, 2.5, 0)
    pl1 = new Player(8.5, 3.5, 180 - 30)
    Player.spawnMany(5);
    fov = 90
    res.setRes(width / 4);
    mapZoomed = false
    cls = fitMap()
    mapOff = getMapOff()
    drawOff = getDrawMapOff()
    ceilClr = 'lightBlue'
    floorClr = 'lightGreen'
    placeTxtrNum = 0

    renderMap = false
    renderView = true
}


window.draw = function () {
    castRays(pl0.pos, pl0.ang, res)
    if (renderView) drawView(pl0.pos, rayBuff)
    if (renderMap) drawMap(pl0.pos, rayBuff)
    fill(0, 127)
    if (!pl0.alive) rect(0, 0, width, height)
    if (pointerLocked()) {
        pl0.move(87, 65, 83, 68)
        pl1.move(UP_ARROW, LEFT_ARROW, DOWN_ARROW, RIGHT_ARROW) // for testings
    }
    Bullet.updateAll();
}

function pointerLocked() {
    return document.pointerLockElement !== null;
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


// Input functions

function mouseWheel(event) {
    let scroll = event.delta < 0
    if (scroll) cls *= 1.1
    else cls /= 1.1

    mapZoomed = cls * mCols > width || cls * mRows > height
    if (!mapZoomed) cls = fitMap()

    mapOff = getMapOff()
    drawOff = getDrawMapOff()
    return false;
}

function setKeyNum(kc) {
    let kn = kc - 48
    if (kn < 0 || kn > textures.length) {
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
        placeCell(map, getCell(mx, my), placeTxtrNum)
}


// Update functions

function updateMouse() {
    mx = mouseX - mapOff.x
    my = mouseY - mapOff.y
    if (mapZoomed) {
        mx += (pl0.pos.x - mCols / 2) * cls
        my += (pl0.pos.y - mRows / 2) * cls
    }
}

function placeCell(mtrx, cell, val = 0) {
    if (cell != undefined) mtrx[cell.y][cell.x] = val
}


// Draw functions

function drawMap(pos, rayBuff, num = 5) {
    push()
    drawOff = getDrawMapOff()
    translate(drawOff.x, drawOff.y)
    // stroke(127)
    // strokeWeight(cls / 16)
    drawMatrix(map, 0.8)

    // draw Players
    Player.all.forEach(p => {
        let { pos, ang } = p;
        noStroke()
        fill(127, 127)
        circle(pos.x * cls, pos.y * cls, cls)
        fill(0, 222)
        circle(pos.x * cls, pos.y * cls, cls * 2 * Player.rad)
        stroke(127, 0, 127, 200)
        let l = cls / 2
        line(pos.x * cls, pos.y * cls,
            pos.x * cls + l * Math.cos(radians(ang)),
            pos.y * cls - l * Math.sin(radians(ang)))
    })

    // draw view rays
    let inc = (rayBuff.length - 1) / (num - 1)
    for (let i = 0; i < rayBuff.length; i += inc) {
        stroke(255, 0, 0, 222)
        strokeWeight(cls / 16)
        let ray = rayBuff[Math.floor(i)]
        line(pos.x * cls, pos.y * cls, ray.x * cls, ray.y * cls)
        noStroke()
        fill(255, 255, 0, 222)
        circle(ray.x * cls, ray.y * cls, cls / 4)
    }
    pop()
}

function drawMatrix(mtrx, t = 1) {
    let xMin = 0
    let xMax = mtrx[0].length
    if (drawOff.x < 0) xMin -= floor(drawOff.x / cls) + 1
    let rightOff = drawOff.x + cls * mCols - width
    xMax -= floor(rightOff / cls)
    if (xMax > mtrx[0].length) xMax = mtrx[0].length

    let yMin = 0
    let yMax = mtrx.length
    if (drawOff.y < 0) yMin -= floor(drawOff.y / cls) + 1
    let bottomOff = drawOff.y + cls * mRows - height
    yMax -= floor(bottomOff / cls)
    if (yMax > mtrx[0].length) yMax = mtrx.length

    for (let i = yMin; i < yMax; i++) {
        for (let j = xMin; j < xMax; j++) {
            drawCell(mtrx, i, j, t)
        }
    }
}

function drawCell(mtrx, i, j, t = 1) {
    mtrx[i][j] == 0 ? fill(255, 255 * t) : fill(0, 255 * t)
    rect(j * cls, i * cls, cls, cls)
}


// Cellular automata functions

function cellularAutomata(arr, times = 1) {
    let check = copyMatrix(arr)
    let out = copyMatrix(arr)
    for (let cycle = 0; cycle < times; cycle++) {
        for (let i = 0; i < out.length; i++) {
            for (let j = 0; j < out[0].length; j++) {
                let count = countWallNeighbors(check, i, j)
                if (count > 4) {
                    out[i][j] = 1
                } else if (count < 4) {
                    out[i][j] = 0
                }
            }
        }
        check = copyMatrix(out)
    }
    return out
}

function countWallNeighbors(arr, i, j) {
    let count = 0
    for (let k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= arr.length) {
            count += 3
            continue
        }
        for (let l = j - 1; l <= j + 1; l++) {
            if (k - i == 0 && l - j == 0) continue
            if (l < 0 || l >= arr[0].length) {
                count++
                continue
            }
            if (arr[k][l] == 1) {
                count++
            }
        }
    }
    return count
}


//

function makeMap(arr = 0, r, c) {
    let mtrx = []
    if (arr == 0) {
        mtrx = makeMatrix(r, c, 0)
    } else mtrx = arr
    mRows = mtrx.length
    mCols = mtrx[0].length
    return mtrx
}