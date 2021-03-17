let width, height, map, rows, cols, clWidth, clHeight

function setup() {
    width = height = 400
    rows = cols = 8
    createCanvas(width, height)
    background('gray')

    map = makeMatrix(rows, cols)
    showMatrix(map)
    castRay(50 * 3 - 30, 50 * 3 - 20, 45 + 90 * 0)
}

function mouseClicked() {
    flipCell(map, mouseX, mouseY)
}

function castRay(x, y, ang) {
    let pos, dir, off, tg

    pos = { x, y }
    off = getOff(pos)
    dir = getDir(ang)
    tg = tan(radians(ang))
    // first interceptions
    // delta steps
    // https://www.youtube.com/watch?v=eOCQfxRQ2pY&t=296s

    push()
    translate(pos.x, pos.y)
    fill('gray')
    circle(0, 0, 12)
    pop()
}

function getOff(pos) {
    let [cx, cy] = getCell(pos.x, pos.y)
    let x = pos.x - cx * clWidth
    let y = pos.y - cy * clHeight
    return { x, y }
}

function getDir(ang) {
    let x = Math.floor(ang / 180) % 2 ? 1 : -1
    let y = Math.floor((ang - 90) / 180) % 2 ? 1 : -1
    return { x, y }
}

function showCell(mtrx, i, j) {
    mtrx[i][j] == 0 ? fill(255) : fill(0)
    rect(i * clWidth, j * clHeight, clWidth, clHeight)
}

function getCell(x, y) {
    let i = Math.floor(x / clWidth)
    let j = Math.floor(y / clHeight)
    return [i, j]
}

function flipCell(mtrx, x, y) {
    let [i, j] = getCell(x, y)
    mtrx[i][j] ^= 1
    showCell(mtrx, i, j)
}

function makeMatrix(rows, cols) {
    let mtrx = []
    for (let i = 0; i < rows; i++) {
        mtrx.push(new Array(rows))
        for (let j = 0; j < cols; j++) {
            mtrx[i][j] = 0
        }
    }
    clWidth = width / cols
    clHeight = height / rows
    return mtrx
}

function showMatrix(mtrx) {
    mtrx.forEach((row, i) => {
        row.forEach((cell, j) => {
            showCell(mtrx, i, j)
        })
    });
}