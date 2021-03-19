let width, height, map, rows, cols, clw, clh

function setup() {
    width = height = 400
    rows = cols = 8
    createCanvas(width, height)
    background('gray')

    map = makeMatrix(rows, cols)
    showMatrix(map)
    castRay(50 * 3 - 35, 50 * 3 - 20, 30 + 90 * 0)
}

function mouseClicked() {
    // flipCell(map, mouseX, mouseY)
    let tmx = mouseX
    let tmy = mouseY
    for (let ang = 0; ang <= 360; ang++) {
        setTimeout(() => {
            showMatrix(map)
            castRay(tmx, tmy, ang)
        }, ang * 10)
    }
}

function castRay(x, y, ang) {
    let pos, dir, off, tg, xsi, ysi, dx, dy

    pos = { x, y }
    off = getOff(pos)
    dir = getDir(ang)
    tg = abs(tan(radians(ang)))
    xsi = getXsi(pos, off, dir, tg)
    ysi = getYsi(pos, off, dir, tg)
    dx = getDx(dir, tg)
    dy = getDy(dir, tg)

    // https://www.youtube.com/watch?v=eOCQfxRQ2pY&t=296s

    fill('green')
    circle(ysi.x, ysi.y, 10)
    circle(ysi.x + clw * dir.x, ysi.y + dy, 12)
    fill('red')
    circle(xsi.x, xsi.y, 10)
    circle(xsi.x + dx, xsi.y + clh * dir.y, 12)
    line(pos.x, pos.y, xsi.x, xsi.y)
    line(pos.x, pos.y, ysi.x, ysi.y)
    fill('gray')
    circle(pos.x, pos.y, 12)
}

function getDx(dir, tg) {
    return clh / tg * dir.x
}
function getDy(dir, tg) {
    return clw * tg * dir.y
}

function getYsi(pos, off, dir, tg) {
    let x = pos.x - off.x + clh * (1 + dir.x) / 2
    let y = pos.y + abs(x - pos.x) * tg * dir.y
    return { x, y }
}
function getXsi(pos, off, dir, tg) {
    let y = pos.y - off.y + clw * (1 + dir.y) / 2
    let x = pos.x + abs(y - pos.y) / tg * dir.x
    return { x, y }
}

function getOff(pos) {
    let [cx, cy] = getCell(pos.x, pos.y)
    let x = pos.x - cx * clw
    let y = pos.y - cy * clh
    return { x, y }
}

function getDir(ang) {
    let y = Math.floor(ang / 180) % 2 ? 1 : -1
    let x = Math.floor((ang - 90) / 180) % 2 ? 1 : -1
    return { x, y }
}

function showCell(mtrx, i, j) {
    mtrx[i][j] == 0 ? fill(255) : fill(0)
    rect(i * clw, j * clh, clw, clh)
}

function getCell(x, y) {
    let i = Math.floor(x / clw)
    let j = Math.floor(y / clh)
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
    clw = width / cols
    clh = height / rows
    return mtrx
}

function showMatrix(mtrx) {
    mtrx.forEach((row, i) => {
        row.forEach((cell, j) => {
            showCell(mtrx, i, j)
        })
    });
}