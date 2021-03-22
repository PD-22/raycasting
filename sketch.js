let width, height, map, rows, cols, clw, clh, pos, ang, ratio, rotate

// remove block stretch (1 size)

function setup() {
    map = makeMatrix([
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
        [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
        [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1,],
        [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,],
        [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1,],

    ])

    map = makeMatrix(cellularAutomata(ranMatrix(18 * 3, 32 * 3, 0.45), 8))

    myCanvas()

    clw = width / cols
    clh = height / rows

    pos = { x: width / 2 - 20, y: height / 2 - 20 } // interesction bug
    ang = 0
    rotate = false
}

function draw() {
    showMatrix(map)
    drawBackground()
    castRays(pos, ang)
    move()
    if (rotate) ang += movedX * 0.8
}

function move() { // diagonal vel, collision
    let speed = clw / 4
    let vel = { x: speed * cos(radians(ang)), y: -speed * sin(radians(ang)) }
    let vel2 = { x: vel.y, y: -vel.x }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        pos.x += vel.x
        pos.y += vel.y
        if (pos.y < 0 || getCellVal(pos.y, pos.x)) pos.y += d //
    }

    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        pos.x -= vel.x
        pos.y -= vel.y
        if (pos.y < 0 || getCellVal(pos.y, pos.x)) pos.y += d //
    }

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        pos.x -= vel2.x
        pos.y -= vel2.y
        if (pos.y < 0 || getCellVal(pos.y, pos.x)) pos.y += d //
    }

    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        pos.x += vel2.x
        pos.y += vel2.y
        if (pos.y < 0 || getCellVal(pos.y, pos.x)) pos.y += d //
    }
}

function drawBackground() {
    push()
    fill(0, 0, 255)
    rect(0, 0, width, height / 2)
    fill(0, 255, 0)
    rect(0, height / 2, width, height / 2)
    pop()
}

function mousePressed() {
    rotate ? exitPointerLock() : requestPointerLock();
    rotate ^= 1
}

function ranMatrix(r, c, chance = 0.5) {
    let mtrx = []
    for (let i = 0; i < r; i++) {
        mtrx.push(new Array(c))
        for (let j = 0; j < c; j++) {
            mtrx[i][j] = random() < chance ? 1 : 0;
        }
    }
    return mtrx
}

function copyMatrix(arrOut) {
    let arrIn = []
    for (let i = 0; i < arrOut.length; i++) {
        arrIn[i] = new Array(arrOut.length)
        for (let j = 0; j < arrOut[0].length; j++) {
            arrIn[i][j] = arrOut[i][j]
        }
    }
    return arrIn
}

function cellularAutomata(arr, times = 1) {
    let check = copyMatrix(arr)
    let temp = copyMatrix(arr)
    for (let cycle = 0; cycle < times; cycle++) {
        for (let i = 0; i < temp.length; i++) {
            for (let j = 0; j < temp[0].length; j++) {
                let count = countWallNeighbors(check, i, j)
                if (count > 4) {
                    temp[i][j] = 1
                } else if (count < 4) {
                    temp[i][j] = 0
                }
            }
        }
        check = copyMatrix(temp)
    }
    return temp
}

function countWallNeighbors(arr, i, j) {
    let count = 0
    for (let k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= arr.length) {
            count += 3
            continue
        }
        for (let l = j - 1; l <= j + 1; l++) {
            if (k - i == 0 && l - j == 0) continue
            if (l < 0 || l >= arr[0].length) {
                count++
                continue
            }
            if (arr[k][l] == 1) {
                count++
            }
        }
    }
    return count
}

function myCanvas(minsize) {
    ratio = rows / cols
    if (window.innerWidth * ratio < window.innerHeight) {
        width = minsize || window.innerWidth
        height = width * ratio
        createCanvas(width, height)
    } else {
        height = minsize || window.innerHeight
        width = height / ratio
        createCanvas(width, height)
    }
}

function castRays(pos, offAng) { // fix col size/offset // rotate map is inverseaa
    fov = 90
    for (let ang = offAng - fov / 2; ang < offAng + fov / 2; ang += 0.5) {
        let its = castRay(pos, ang)
        let d = sqrt((pos.x - its.x) ** 2 + (pos.y - its.y) ** 2) // or use trig // get x/y
        let p = d * cos(radians(ang - offAng))
        let h = clw * width / p
        let off = (ang - offAng + fov / 2) * width / fov
        let leftOff = off % 2
        off = off - leftOff
        push()
        noStroke()
        if (its.axis === 'x') {
            fill(255, 0, 0)
        } else {
            fill(191, 0, 0)
        }
        rect(off, (height - h) / 2, width / fov / 2 + leftOff, h)
        pop()
    }
}

function castRay(pos, ang) {
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
                return { x: xsi.x, y: xsi.y, axis: 'x' }
            }
            xsi.x += clw * dir.x
            xsi.y += dy
        }
        while (abs(pos.y - ysi.y) <= abs(pos.y - xsi.y)) {
            cell.y += dir.y
            if (map[cell.y] == undefined || map[cell.y][cell.x]) {
                return { x: ysi.x, y: ysi.y, axis: 'y' }
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
    if (px < 0 || py < 0 || px > width || py > height) return undefined
    let x = Math.floor(px / clw)
    let y = Math.floor(py / clh)
    return { x, y }
}

function getCellVal(py, px) {
    let cell = getCell(px, py)
    if (cell == undefined) return undefined
    return map[cell.y][cell.x]
}

function flipCell(mtrx, x, y, opt) { // use vertex draw
    let cl = getCell(x, y)
    if (cl == undefined) return undefined
    mtrx[cl.y][cl.x] =
        opt == undefined ? mtrx[cl.y][cl.x] ^ 1 :
            opt ? 1 : 0
    showCell(mtrx, cl.y, cl.x)
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