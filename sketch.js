let
    width, height, map, rows, cols,
    cls, place, pos, ang, ratio,
    rotate, rayBuf, fov, renderMap, renderView,
    pointerLock, speed, res, rad, mapOff,
    showFps, mx, my, ceilClr, floorClr

/*
interesction bug
big map lag
mobile compatibility
group functions, make classes
ray and pos border teleport
constant render distance
remove dif map controls
only update some functions at change
texture mapping...
    fix texture direction
    fix texture skewing
    add drawTexture function
*/

function setup() {
    createMyCanvas()
    background('gray')

    map = makeMap([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ])

    texture1 = rt(8, 8)

    function rt(r, c) {
        let mtrx = makeMatrix(r, c)
        for (let i = 0; i < r; i++)
            for (let j = 0; j < c; j++)
                mtrx[i][j] = rc()
        return mtrx
    }

    function rc() {
        return [
            [Math.floor(Math.random() * 256)],
            [Math.floor(Math.random() * 256)],
            [Math.floor(Math.random() * 256)]
        ]
    }

    // map = makeMap(
    //     cellularAutomata(
    //         makeMatrix(24, 24, 0.42), 2
    //     )
    // )

    pos = { x: cols / 2 - 0.2, y: rows / 2 - 0.2 }
    fov = 90
    ang = 0
    res = width / 2
    rad = 1 / 4
    cls = width / 32
    mapOff = {
        x: (width - cols * cls) / 2,
        y: (height - rows * cls) / 2
    }
    ceilClr = 'lightBlue'
    floorClr = 'lightGreen'

    renderMap = false
    renderView = true
    rotate = false
    pointerLock = false
}

function draw() {
    rayBuf = castRays(ang, res)
    if (renderView) drawView(pos, rayBuf, ceilClr, floorClr)
    if (renderMap) drawMap(pos, rayBuf)
    move(ang)
}

function createMyCanvas() {
    ratio = window.screen.height / window.screen.width
    width = window.innerWidth
    height = width * ratio
    if (height > window.innerHeight) {
        height = window.innerHeight
        width = height / ratio
    }
    createCanvas(width, height)
}

function mouseOnMap() {
    return (
        renderMap &&
        mx > 0 && mx < cols * cls &&
        my > 0 && my < rows * cls
    )
}

function renderMode(opt = 1) {
    if (opt == 1) {
        renderMap = false
        rotate = true
        pointerLock = true
        requestPointerLock()
    } else if (opt == 2) {
        renderMap = true
        rotate = false
        pointerLock = false
        exitPointerLock()
    }
}


// Input functions

function keyPressed() {
    if (keyCode == 70) {
        if (renderMap) {
            renderMode(1)
        } else {
            renderMode(2)
        }
    }
}

function mousePressed() {
    if (renderMap) {
        if (mouseOnMap()) {
            let cell = getCell(mx, my)
            place = 1 - getCellVal(cell)
            flipCell(map, cell)
        } else {
            renderMode(1)
        }
    } else if (renderView) {
        renderMode(1)
    }
}

function mouseMoved() {
    updateAng()
}

function mouseDragged() {
    updateMouse()
    if (renderMap)
        flipCell(
            map,
            getCell(mx, my)
        )
}


// Update functions

function updateMouse() {
    mx = mouseX - mapOff.x + (pos.x - cols / 2) * cls
    my = mouseY - mapOff.y + (pos.y - rows / 2) * cls
}

function flipCell(mtrx, cell) {
    if (cell != undefined) mtrx[cell.y][cell.x] = place ? 1 : 0
}

function updateAng() {
    updateMouse()
    if (renderMap) {
        ang = degrees(Math.atan2(
            mx - pos.x * cls,
            my - pos.y * cls,
        )) - 90
    } else if (rotate) {
        ang -= movedX * deltaTime / 100
        ang %= 360
    }
}

function move(ang, s) {
    if (s == undefined) {
        speed = keyIsDown(SHIFT) ? 2 : 1
    } else {
        speed = s
    }
    speed *= deltaTime / 24

    let vel = { x: 0, y: 0 }
    let dir = { x: 0, y: 0 }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) dir.y = -1
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) dir.y = 1
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) dir.x = 1
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) dir.x = -1

    if (renderMap) {
        vel.y = dir.y
        vel.x = dir.x
    } else {
        if (dir.y == -1) {
            vel.y += -sin(radians(ang))
            vel.x += cos(radians(ang))
        }
        if (dir.y == 1) {
            vel.y += sin(radians(ang))
            vel.x += -cos(radians(ang))
        }
        if (dir.x == -1) {
            vel.y += -cos(radians(ang))
            vel.x += -sin(radians(ang))
        }
        if (dir.x == 1) {
            vel.y += cos(radians(ang))
            vel.x += sin(radians(ang))
        }

        dir.x = vel.x
        if (dir.x != 0) dir.x = (dir.x > 0) * 2 - 1
        dir.y = vel.y
        if (dir.y != 0) dir.y = (dir.y > 0) * 2 - 1
    }

    let mag = sqrt(vel.x ** 2 + vel.y ** 2)
    if (mag != 0) {
        vel.x /= mag
        vel.y /= mag
    }

    if (speed != undefined) {
        vel.y *= speed
        vel.x *= speed
    }
    vel.y /= 24
    vel.x /= 24

    let cell

    pos.x += vel.x
    pos.y += vel.y

    cell = getCell(pos.x, pos.y + dir.y * rad, false)
    if (getCellVal(cell)) {
        pos.y = cell.y + 0.5 - dir.y * 0.5 - dir.y * rad
    }

    cell = getCell(pos.x + dir.x * rad, pos.y, false)
    if (getCellVal(cell)) {
        pos.x = cell.x + 0.5 - dir.x * 0.5 - dir.x * rad
    }

    if (dir.x != 0 || dir.y != 0 && renderMap) updateAng()
}


// Draw functions

function drawView(pos, rayBuf, tclr = 170, bclr = 85) {
    push()
    fill(tclr)
    rect(0, 0, width, height / 2)
    fill(bclr)
    rect(0, height / 2, width, height / 2)

    let w = width / rayBuf.length
    rayBuf.forEach((its, i) => {
        let d = sqrt((pos.x - its.x) ** 2 + (pos.y - its.y) ** 2)
        let offAng = its.ang
        let p = d * cos(radians(ang - offAng))
        let h = width / p / 2
        let colw = width / res
        h = round(h / colw) * colw
        noStroke()
        let txcl
        if (its.axis === 'x') {
            txcl = its.y % 1
            fill(255, 0, 0)
        } else {
            txcl = its.x % 1
            fill(191, 0, 0)
        }

        drawTextureCol(texture1, i, h, txcl, w)

        // rect(
        //     Math.round(i * w),
        //     (height - h) / 2,
        //     w, h
        // )
    })

    pop()
}

function drawTextureCol(txtr, i, h, txcl, w) {
    let rows = txtr.length
    let cols = txtr[0].length
    let wcHeight = h / rows

    for (let y = 0; y < rows; y++) {
        let x = floor(txcl * cols)
        let color = txtr[y][x]
        fill(color)
        rect(
            Math.round(i * w),
            (height - h) / 2 + wcHeight * y,
            w, wcHeight
        )
    }
}

function drawMap(pos, rayBuf, num = 5) {
    push()
    translate(
        mapOff.x - (pos.x - cols / 2) * cls,
        mapOff.y - (pos.y - rows / 2) * cls,
    )
    stroke(127)
    strokeWeight(cls / 16)
    drawMatrix(map, 0.8)

    noStroke()
    fill('gray')
    circle(pos.x * cls, pos.y * cls, cls)
    fill('black')
    circle(pos.x * cls, pos.y * cls, cls * 2 * rad)

    let inc = (rayBuf.length - 1) / (num - 1)
    for (let i = 0; i < rayBuf.length; i += inc) {
        stroke('red')
        strokeWeight(cls / 16)
        let ray = rayBuf[Math.floor(i)]
        line(pos.x * cls, pos.y * cls, ray.x * cls, ray.y * cls)
        noStroke()
        fill('yellow')
        circle(ray.x * cls, ray.y * cls, cls / 4)
    }
    pop()
}

function drawMatrix(mtrx, t = 1) {
    for (let i = 0; i < mtrx.length; i++) {
        for (let j = 0; j < mtrx[0].length; j++) {
            drawCell(mtrx, i, j, t)
        }
    }
}

function drawCell(mtrx, i, j, t = 1) {
    mtrx[i][j] == 0 ? fill(255, 255 * t) : fill(0, 255 * t)
    rect(j * cls, i * cls, cls, cls)
}


// Ray casting functions

function castRays(offAng, r = width) {
    res = r
    rayBuf = []
    let inc = fov / res
    for (let ang = offAng - fov / 2; ang < offAng + fov / 2; ang += inc) {
        let its = castRay(pos, ang)
        rayBuf.unshift(its)
    }
    return rayBuf
}

function castRay(pos, ang) {
    let cell = { x: Math.floor(pos.x), y: Math.floor(pos.y) }
    let off = getOff(pos, cell)
    let dir = getDir(ang)
    let tg = abs(tan(radians(ang)))
    let ctg = 1 / tg
    let xsi = getXsfi(pos, off, dir, tg)
    let ysi = getYsfi(pos, off, dir, ctg)
    let dx = getDx(dir, ctg)
    let dy = getDy(dir, tg)

    while (true) {
        while (abs(pos.x - xsi.x) <= abs(pos.x - ysi.x)) {
            cell.x += dir.x
            if (map[cell.y][cell.x] == undefined || map[cell.y][cell.x] != 0) {
                return { x: xsi.x, y: xsi.y, axis: 'x', ang }
            }
            xsi.x += dir.x
            xsi.y += dy
        }
        while (abs(pos.y - ysi.y) <= abs(pos.y - xsi.y)) {
            cell.y += dir.y
            if (map[cell.y] == undefined || map[cell.y][cell.x] != 0) {
                return { x: ysi.x, y: ysi.y, axis: 'y', ang }
            }
            ysi.x += dx
            ysi.y += dir.y
        }
    }
}

function getOff(pos, cell) {
    let x = pos.x - cell.x
    let y = pos.y - cell.y
    return { x, y }
}

function getDir(ang) {
    let y = Math.floor(ang / 180) % 2 ? 1 : -1
    let x = Math.floor((ang - 90) / 180) % 2 ? 1 : -1
    return { x, y }
}

function getXsfi(pos, off, dir, tg) {
    let x = pos.x - off.x + (1 + dir.x) / 2
    let y = pos.y + abs(x - pos.x) * tg * dir.y
    return { x, y }
}

function getYsfi(pos, off, dir, ctg) {
    let y = pos.y - off.y + (1 + dir.y) / 2
    let x = pos.x + abs(y - pos.y) * ctg * dir.x
    return { x, y }
}

function getDx(dir, ctg) {
    return ctg * dir.x
}

function getDy(dir, tg) {
    return tg * dir.y
}


// Cellular automata functions

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


// Matrix functions

function getCell(x1, y1, px = true) {
    let x = Math.floor(px ? x1 / cls : x1)
    let y = Math.floor(px ? y1 / cls : y1)
    if (x < 0 || y < 0 || x >= cols || y >= rows) return undefined
    return { x, y }
}

function getCellVal(cell) {
    if (cell == undefined) return undefined
    return map[cell.y][cell.x]
}

function makeMap(arr, r, c) {
    let mtrx = []
    if (arr == 0) {
        mtrx = makeMatrix(r, c, 0)
    } else mtrx = arr
    rows = mtrx.length
    cols = mtrx[0].length
    mapOff = {
        x: (width - cols * cls) / 2,
        y: (height - rows * cls) / 2
    }
    return mtrx
}

function makeMatrix(r, c, p = 0) {
    let mtrx = []
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

function copyMatrix(arrOut) {
    let arrIn = []
    for (let i = 0; i < arrOut.length; i++) {
        arrIn[i] = new Array(arrOut[0].length)
        for (let j = 0; j < arrOut[0].length; j++) {
            arrIn[i][j] = arrOut[i][j]
        }
    }
    return arrIn
}