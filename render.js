import { cls, ceilClr, floorClr, pl0 } from "./sketch.js";
import { mRows, mCols } from "./Matrix.js";
import Sprite from "./Sprite.js";
import Player from "./Player.js";
import { getTxtrOff, rayBuff } from "./rayCasting.js";
import { wallTextures, map } from "./data.js";
import { multClr } from "./textures.js";

export let res, pxl;
export function setRes(v) { res = v };

export function calcColHeight(its) {
    let p = its.dst * cos(radians(pl0.ang - its.ang))
    let h = height / p
    pxl = width / res
    h = round(h / pxl) * pxl
    return h
}

export function fitMap() { // should depend on resolution
    return height / mRows
}

export let mapOff, drawOff;

export function setDrawMapOff() {
    if (cls * mCols > width || cls * mRows > height) {
        drawOff = {
            x: mapOff.x - (pl0.pos.x - mCols / 2) * cls,
            y: mapOff.y - (pl0.pos.y - mRows / 2) * cls
        }
    } else drawOff = { x: mapOff.x, y: mapOff.y }
}

export function setMapOff() {
    mapOff = {
        x: (width - mCols * cls) / 2,
        y: (height - mRows * cls) / 2
    }
}

export function drawTextureCol(its, i, h, w, txtr) {
    let txtrOff = its.txtrOff
        || getTxtrOff(its, its.side, its.dir)

    if (txtrOff >= 1) throw new Error('txtrOff over max')

    let rows = txtr.length
    let cols = txtr[0].length
    let wcHeight = h / rows

    for (let y = 0; y < rows; y++) {
        let x = floor(txtrOff * cols)
        let color = txtr[y][x]
        if (color < 0) continue
        if (its.side != undefined && its.side == 'y')
            color = multClr(color, 0.8)
        fill(color)
        rect(
            Math.round(i * w),
            (height - h) / 2 + wcHeight * y,
            w, wcHeight
        )
    }
}

export function drawMap(pos, rayBuff, num = 5) {
    push()
    setDrawMapOff()
    translate(drawOff.x, drawOff.y)
    stroke(127)
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

export function drawMatrix(mtrx, t = 1) {
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

export function drawCell(mtrx, i, j, t = 1) {
    mtrx[i][j] == 0 ? fill(255, 255 * t) : fill(0, 255 * t)
    rect(j * cls, i * cls, cls, cls)
}

export function drawView(pos, rayBuf) {
    noStroke()
    push()
    fill(ceilClr)
    rect(0, 0, width, height / 2)
    fill(floorClr)
    rect(0, height / 2, width, height / 2)
    pop()

    rayBuff.forEach((its, i) => {
        let h = calcColHeight(its)
        drawTextureCol(its, i, h, pxl, wallTextures[its.val])
        Sprite.castAll(its.dst, i)
    })

    // aim dot
    push()
    let r = width / 100
    r -= r / 4 * pl0.aim
    stroke(0)
    strokeWeight(r / 4)
    fill(255)
    rectMode(CENTER)
    square(width / 2, height / 2, r)
    pop()
}