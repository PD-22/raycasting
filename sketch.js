let width, height, map, rows, cols, clw, clh

function setup() {
    width = height = 512
    rows = cols = 16
    createCanvas(width, height)
    background('gray')

    map = makeMatrix(rows, cols)
    showMatrix(map)

    myCast()
}

function myCast() {
    showMatrix(map)
    for (let ang = 0; ang < 360; ang++) {
        let its = castRay(50 * 6 - 30, 50 * 6 - 30, ang)
    }
}

function mouseClicked() {
    flipCell(map, mouseX, mouseY)
    myCast()
}

function castRay(x, y, ang) {
    let pos, dir, off, tg, xsi, ysi, dx, dy, cell

    pos = { x, y }
    cell = getCell(pos.x, pos.y)
    off = getOff(pos, cell)
    dir = getDir(ang)
    tg = abs(tan(radians(ang)))
    xsi = getXsi(pos, off, dir, tg)
    ysi = getYsi(pos, off, dir, tg)
    dx = getDx(dir, tg)
    dy = getDy(dir, tg)

    fill('gray')
    circle(pos.x, pos.y, 12)

    while (true) {
        while (abs(pos.x - xsi.x) <= abs(pos.x - ysi.x)) {
            cell.x += dir.x
            if (map[cell.x] == undefined || map[cell.x][cell.y]) {
                line(pos.x, pos.y, xsi.x, xsi.y)
                return xsi
            }
            xsi.x += clw * dir.x
            xsi.y += dy
        }
        while (abs(pos.y - ysi.y) <= abs(pos.y - xsi.y)) {
            cell.y += dir.y
            if (map[cell.x][cell.y] == undefined || map[cell.x][cell.y]) {
                line(pos.x, pos.y, ysi.x, ysi.y)
                return ysi
            }
            ysi.x += dx
            ysi.y += clh * dir.y
        }
    }

    // https://www.youtube.com/watch?v=eOCQfxRQ2pY&t=296s
}

function getDx(dir, tg) {
    return clh / tg * dir.x
}

function getDy(dir, tg) {
    return clw * tg * dir.y
}

function getYsi(pos, off, dir, tg) {
    let y = pos.y - off.y + clw * (1 + dir.y) / 2
    let x = pos.x + abs(y - pos.y) / tg * dir.x
    return { x, y }
}

function getXsi(pos, off, dir, tg) {
    let x = pos.x - off.x + clh * (1 + dir.x) / 2
    let y = pos.y + abs(x - pos.x) * tg * dir.y
    return { x, y }
}

function getOff(pos, cell) {
    let x = pos.x - cell.x * clw
    let y = pos.y - cell.y * clh
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

function getCell(px, py) {
    let x = Math.floor(px / clw)
    let y = Math.floor(py / clh)
    return { x, y }
}

function flipCell(mtrx, x, y) {
    if (x < 0 || x > width || y < 0 || y > height) return
    let cl = getCell(x, y)
    mtrx[cl.x][cl.y] ^= 1
    showCell(mtrx, cl.x, cl.y)
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