let width, height, map, rows, cols, clw, clh

function setup() {
    width = height = 400
    rows = cols = 8
    createCanvas(width, height)
    background('gray')

    map = makeMatrix(rows, cols)
    showMatrix(map)
    let its = castRay(50 * 3 - 30, 50 * 3 - 30, -30)
    circle(its.x, its.y, 10)
}

function mouseClicked() {
    flipCell(map, mouseX, mouseY)
    showMatrix(map)
    let its = castRay(50 * 3 - 30, 50 * 3 - 30, -30)
    circle(its.x, its.y, 10)
    // let tmx = mouseX
    // let tmy = mouseY
    // for (let ang = 0; ang <= 360; ang++) {
    //     setTimeout(() => {
    //         showMatrix(map)
    //         let its = castRay(tmx, tmy, ang)
    //         circle(its.x, its.y, 10)
    //     }, ang * 5)
    // }
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

    while (true) { // sanam fanjarashi xar
        // romlit iwyeb unda ganvsazgvro?
        // ujris damatebac vera
        // shedareba arasworia?
        // gaanalize cvlileba xstep tu ystep
        while (abs(xsi.x - ysi.x) > 0) {
            console.log('x');
            cell.x += dir.x
            if (map[cell.x][cell.y]) {
                line(pos.x, pos.y, xsi.x, xsi.y)
                return xsi
            }
            xsi.x += clw * dir.x
            xsi.y += dy
        }
        while (abs(ysi.y - xsi.y) > 0) {
            console.log('y');
            cell.y += dir.y
            if (map[cell.x][cell.y]) {
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
    let cl = getCell(x, y)
    mtrx[cl.x][cl.y] ^= 1
    showCell(mtrx, cl.x, cl.y)
}

function makeMatrix(rows, cols) {
    let mtrx = []
    for (let i = 0; i < rows; i++) {
        mtrx.push(new Array(rows))
        for (let j = 0; j < cols; j++) {
            mtrx[i][j] = i == 0 || j == 0 || i == rows - 1 || j == cols - 1
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