import {
    cls, mRows, mCols, mapOff, ceilClr, floorClr, pl0, wallTextures
} from "./sketch.js";
import Sprite from "./Sprite.js";
import { getTxtrOff } from "./rayCasting.js";

let res, pxl;

res = { value: undefined, setRes: (v) => res.value = v }

export { res, pxl };

export function drawView(pos, rayBuf) {
    noStroke()
    push()
    fill(ceilClr)
    rect(0, 0, width, height / 2)
    fill(floorClr)
    rect(0, height / 2, width, height / 2)
    pop()

    rayBuf.forEach((its, i) => {
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

export function getDrawMapOff() {
    if (cls * mCols > width || cls * mRows > height) {
        return {
            x: mapOff.x - (pl0.pos.x - mCols / 2) * cls,
            y: mapOff.y - (pl0.pos.y - mRows / 2) * cls
        }
    } else return { x: mapOff.x, y: mapOff.y }
}
export function getMapOff() {
    return {
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