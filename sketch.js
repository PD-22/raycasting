let width, height, map, rows, cols, clw, clh, pos, ang, place

function setup() {
    map = makeMatrix([
        [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ])

    let ratio = rows / cols

    if (window.innerWidth * ratio < window.innerHeight) {
        width = window.innerWidth - window.innerWidth % 2
        height = width * ratio
        createCanvas(width, height)
    } else {
        height = window.innerHeight - window.innerHeight % 2
        width = height / ratio
        createCanvas(width, height)
    }

    clw = width / cols
    clh = height / rows

    pos = { x: width / 2 - 20, y: height / 2 - 20 }
    ang = 0
}

function draw() {
    showMatrix(map)
    castRays(pos, ang)
    move()
    ang = getMouseAng(pos)
}

function mousePressed() {
    place = getCellVal(mouseY, mouseX) ^ 1
    flipCell(map, mouseY, mouseX, place)
}

function mouseDragged() {
    flipCell(map, mouseY, mouseX, place)
}

function touchStarted() {
    pos.x = mouseX
    pos.y = mouseY
    tempPlace = false
}

function touchMoved() {
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

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // diagonal speed
        pos.x -= clw / d
        if (pos.x < 0 || getCellVal(pos.y, pos.x)) pos.x += clw / d
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        pos.x += clw / d
        if (pos.x > width || getCellVal(pos.y, pos.x)) pos.x -= clw / d
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        pos.y -= clh / d
        if (pos.y < 0 || getCellVal(pos.y, pos.x)) pos.y += clh / d
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        pos.y += clh / d
        if (pos.y > height || getCellVal(pos.y, pos.x)) pos.y -= clh / d
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

function castRay(pos, ang) { // bug at grid intersection pos or big screen draw
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
            if (map[cell.y][cell.x] == undefined || map[cell.y][cell.x]) {
                return xsi
            }
            xsi.x += clw * dir.x
            xsi.y += dy
        }
        while (abs(pos.y - ysi.y) <= abs(pos.y - xsi.y)) {
            cell.y += dir.y
            if (map[cell.y] == undefined || map[cell.y][cell.x]) {
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
    rect(j * clw, i * clh, clw, clh)
}

function getCell(px, py) {
    let x = Math.floor(px / clw)
    let y = Math.floor(py / clh)
    return { x, y }
}

function getCellVal(px, py) {
    let cell = getCell(px, py,)
    return map[cell.x][cell.y]
}

function flipCell(mtrx, x, y, opt) {
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

function makeMatrix(arr, r, c) {
    let mtrx = []
    if (arr == 0) {
        for (let i = 0; i < r; i++) {
            mtrx.push(new Array(r))
            for (let j = 0; j < c; j++) {
                mtrx[i][j] = 0
            }
        }
    } else mtrx = arr
    rows = mtrx.length
    cols = mtrx[0].length
    return mtrx
}

function showMatrix(mtrx) {
    mtrx.forEach((row, i) => {
        row.forEach((cell, j) => {
            showCell(mtrx, i, j)
        })
    });
}