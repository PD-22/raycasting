import { cls } from "./sketch.js";

export function getCell(x1, y1, px = true) {
    let x = Math.floor(px ? x1 / cls : x1)
    let y = Math.floor(px ? y1 / cls : y1)
    return { x, y }
}

export function getCellVal(cell, arr) {
    if (arr[cell.y] == undefined) return undefined
    return arr[cell.y][cell.x]
}

export function makeMatrix(r, c, p = 0) {
    let mtrx = []
    if (c == undefined) c = r;
    for (let i = 0; i < r; i++) {
        mtrx.push(new Array(c))
        for (let j = 0; j < c; j++) {
            if (p == 0 || p == 1) {
                mtrx[i][j] = p
            } else {
                mtrx[i][j] = Math.random() < p ? 1 : 0;
            }
        }
    }
    return mtrx
}

export function copyMatrix(mtrx) {
    let out = []
    for (let i = 0; i < mtrx.length; i++)
        out[i] = Array.from(mtrx[i])
    return out
}

let mRows, mCols;
export function makeMap(arr = 0, r, c) {
    let mtrx = []
    if (arr == 0) {
        mtrx = makeMatrix(r, c, 0)
    } else mtrx = arr
    mRows = mtrx.length
    mCols = mtrx[0].length
    return mtrx
}
export { mRows, mCols };

export function placeCell(mtrx, cell, val = 0) {
    if (cell != undefined) mtrx[cell.y][cell.x] = val
}