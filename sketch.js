let width, height, map, rows, cols, clw, clh, place,
    pos, ang, ratio, rotate, rayBuf, mapVisible, fov

/*
remove ratio?
remove block stretch (1 size)
change clw and clh to cellSize
fullscreen bug
map switch stop rotate
*/

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

    map = makeMatrix(cellularAutomata(ranMatrix(9 * 3, 16 * 3, 0.45), 4))

    myCanvas()

    clw = width / cols
    clh = height / rows

    pos = { x: width / 2 - 20, y: height / 2 - 20 } // interesction bug
    ang = 0
    fov = 90

    mapVisible = false
    rotate = false
}

function draw() {
    rayBuf = castRays(ang, width, 90)
    mapVisible ?
        drawMap(pos, rayBuf) :
        drawView(pos, rayBuf);
    move(ang)
}

function keyPressed() {
    if (keyIsDown(77)) {
        mapVisible ^= 1
        exitPointerLock()
        rotate = false
    }
}

function mouseMoved() {
    if (mapVisible) rotate = true
    if (rotate) updateAng()
}

function mouseDragged() {
    if (mapVisible) {
        flipCell(map, getCell(mouseX, mouseY))
    }
}

function updateAng() {
    if (mapVisible) {
        let mv = { x: mouseX - pos.x, y: mouseY - pos.y }
        ang = -degrees(Math.atan2(mv.y, mv.x))
    } else if (rotate) {
        ang -= movedX * deltaTime / 64
        ang %= 360
    }
}

function drawView(pos, rayBuf) {
    push()
    fill(0, 0, 255)
    rect(0, 0, width, height / 2)
    fill(0, 255, 0)
    rect(0, height / 2, width, height / 2)
    let w = width / rayBuf.length
    rayBuf.forEach((its, i) => {
        let d = sqrt((pos.x - its.x) ** 2 + (pos.y - its.y) ** 2) // or use trig // get x/y
        let offAng = its.ang
        let p = d * cos(radians(ang - offAng))
        let h = clw * width / p / 2
        noStroke()
        if (its.axis === 'x') {
            fill(255, 0, 0)
        } else {
            fill(191, 0, 0)
        }
        rect(i, (height - h) / 2, w, h)
    })
    pop()
}

function drawMap(pos, rayBuf) {
    push()
    showMatrix(map)
    fill('gray')
    circle(pos.x, pos.y, clw)
    stroke('red')
    strokeWeight(clw / 8)
    let top = rayBuf[0]
    let mid = rayBuf[Math.round((rayBuf.length - 1) / 2)]
    let bot = rayBuf[rayBuf.length - 1]
    line(pos.x, pos.y, top.x, top.y)
    line(pos.x, pos.y, mid.x, mid.y)
    line(pos.x, pos.y, bot.x, bot.y)
    noStroke()
    fill('yellow')
    circle(top.x, top.y, clw / 2)
    circle(mid.x, mid.y, clw / 2)
    circle(bot.x, bot.y, clw / 2)
    pop()
}

function move(ang) { // collision // speed depends on screen/cell/map size
    let vel = { x: 0, y: 0 }
    let dir = { x: 0, y: 0 }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        vel.y += -sin(radians(ang))
        vel.x += cos(radians(ang))
        dir.y = -1
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        vel.y += sin(radians(ang))
        vel.x += -cos(radians(ang))
        dir.y = 1
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        vel.y += cos(radians(ang))
        vel.x += sin(radians(ang))
        dir.x = 1
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        vel.y += -cos(radians(ang))
        vel.x += -sin(radians(ang))
        dir.x = -1
    }

    let mag = sqrt(dir.x ** 2 + dir.y ** 2)
    if (mag != 0) {
        vel.x /= mag
        vel.y /= mag
    }

    pos.y += vel.y
    pos.x += vel.x
}

function mousePressed() {
    if (mapVisible) {
        let cell = getCell(mouseX, mouseY)
        place = 1 - getCellVal(cell)
        flipCell(map, cell)
    } else {
        rotate ? exitPointerLock() : requestPointerLock();
        rotate ^= 1
    }
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

function myCanvas(minsize) { // remove stretch
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

function castRays(offAng, num = 90) {
    rayBuf = []
    let inc = fov / num
    for (let ang = offAng - fov / 2; ang < offAng + fov / 2; ang += inc) {
        let its = castRay(pos, ang)
        rayBuf.unshift(its)
    }
    return rayBuf
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
                return { x: xsi.x, y: xsi.y, axis: 'x', ang }
            }
            xsi.x += clw * dir.x
            xsi.y += dy
        }
        while (abs(pos.y - ysi.y) <= abs(pos.y - xsi.y)) {
            cell.y += dir.y
            if (map[cell.y] == undefined || map[cell.y][cell.x]) {
                return { x: ysi.x, y: ysi.y, axis: 'y', ang }
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

function getCellVal(cell) {
    if (cell == undefined) return undefined
    return map[cell.y][cell.x]
}

function flipCell(mtrx, cell) {
    if (cell != undefined) {
        mtrx[cell.y][cell.x] = place ? 1 : 0
    }
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