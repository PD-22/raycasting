// https://www.youtube.com/watch?v=eOCQfxRQ2pY&t=296s

let width, height, map, rows, cols, clw, clh, pos, ang, place

function setup() {
    width = height = 512
    rows = cols = 16
    createCanvas(width, height)
    background('gray')

    map = makeMatrix(rows, cols)
    map = [
        [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    ]
    pos = { x: width / 2 - 20, y: height / 2 - 20 }
    ang = 0
}

function draw() {
    showMatrix(map)
    castRays(pos, ang)
    move()
    ang = getMouseAng(pos)
}

function getMouseAng(pos) {
    let unt = createVector(1, 0)
    let muv = createVector(mouseX - pos.x, mouseY - pos.y)
    muv.normalize()
    return -degrees(unt.angleBetween(muv))
}

function move() {
    let d = 12
    if (keyIsDown(LEFT_ARROW)) {
        pos.x -= clw / d
        if (pos.x < 0 || getCellVal(pos.x, pos.y)) pos.x += clw / d
    }

    if (keyIsDown(RIGHT_ARROW)) {
        pos.x += clw / d
        if (pos.x > width || getCellVal(pos.x, pos.y)) pos.x -= clw / d
    }

    if (keyIsDown(UP_ARROW)) {
        pos.y -= clh / d
        if (pos.y < 0 || getCellVal(pos.x, pos.y)) pos.y += clh / d
    }

    if (keyIsDown(DOWN_ARROW)) {
        pos.y += clh / d
        if (pos.y > height || getCellVal(pos.x, pos.y)) pos.y -= clh / d
    }
}

function castRays(pos, offAng) {
    fov = 90
    for (let ang = offAng - fov / 2; ang < offAng + fov / 2; ang += 0.3) {
        let its = castRay(pos, ang)
        push()
        stroke('red')
        line(pos.x, pos.y, its.x, its.y)
        pop()
    }
    fill('gray')
    circle(pos.x, pos.y, 12)
}

function doubleClicked() {
    requestPointerLock()
}

function mousePressed() {
    place = getCellVal(mouseX, mouseY) ^ 1
    flipCell(map, mouseX, mouseY, place)
}

function mouseDragged() {
    flipCell(map, mouseX, mouseY, place)
}


function castRay(pos, ang) { // bug at grid intersection pos and big screen draw
    let cell, off, dir, tg, xsi, ysi, dx, dy

    cell = getCell(pos.x, pos.y)
    off = getOff(pos, cell)
    dir = getDir(ang)
    tg = abs(tan(radians(ang)))
    xsi = getXsi(pos, off, dir, tg)
    ysi = getYsi(pos, off, dir, tg)
    dx = getDx(dir, tg)
    dy = getDy(dir, tg)

    while (true) {
        while (abs(pos.x - xsi.x) <= abs(pos.x - ysi.x)) {
            cell.x += dir.x
            if (map[cell.x] == undefined || map[cell.x][cell.y]) {
                return xsi
            }
            xsi.x += clw * dir.x
            xsi.y += dy
        }
        while (abs(pos.y - ysi.y) <= abs(pos.y - xsi.y)) {
            cell.y += dir.y
            if (map[cell.x][cell.y] == undefined || map[cell.x][cell.y]) {
                return ysi
            }
            ysi.x += dx
            ysi.y += clh * dir.y
        }
    }
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

function getCellVal(px, py) {
    let x = Math.floor(px / clw)
    let y = Math.floor(py / clh)
    return map[x][y]
}

function flipCell(mtrx, x, y, opt) {
    if (x < 0 || x > width || y < 0 || y > height) return
    let cl = getCell(x, y)
    if (opt == undefined) {
        mtrx[cl.x][cl.y] ^= 1
    } else if (opt == true) {
        mtrx[cl.x][cl.y] = 1
    } else {
        mtrx[cl.x][cl.y] = 0
    }
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