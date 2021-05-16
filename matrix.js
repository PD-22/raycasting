function getCell(x1, y1, px = true) {
    let x = Math.floor(px ? x1 / cls : x1)
    let y = Math.floor(px ? y1 / cls : y1)
    return { x, y }
}

function getCellVal(cell) {
    if (worldMap[cell.y] == undefined) return undefined
    return worldMap[cell.y][cell.x]
}

function makeMap(arr = 0, r, c) {
    let mtrx = []
    if (arr == 0) {
        mtrx = makeMatrix(r, c, 0)
    } else mtrx = arr
    mapHeight = mtrx.length
    mapWidth = mtrx[0].length
    return mtrx
}

function makeMatrix(r, c, p = 0) {
    let mtrx = []
    if (c == undefined) c = r;
    for (let i = 0; i < r; i++) {
        mtrx.push(new Array(c))
        for (let j = 0; j < c; j++) {
            if (p == 0 || p == 1) {
                mtrx[i][j] = p
            } else {
                mtrx[i][j] = random() < p ? 1 : 0;
            }
        }
    }
    return mtrx
}

function copyMatrix(mtrx) {
    let out = []
    for (let i = 0; i < mtrx.length; i++)
        out[i] = Array.from(mtrx[i])
    return out
}

function placeCell(mtrx, cell, val = 0) {
    if (cell != undefined) mtrx[cell.y][cell.x] = val
}