let
    width, height, map, mRows, mCols, cls, ratio, mapZoomed,
    canRotate, canMove, rayBuf, fov, renderMap, renderView,
    pointerLock, speed, res, mapOff, drawOff, pxl,
    mx, my, ceilClr, floorClr, textures, placeTxtrNum, plrTxtrs,
    pl0, pl1

/*
interesction bug?
mobile compatibility
fullscreen crashes
ray and pos border teleport
only update some functions at change
fix shoot cast
    bug draw plr txtr because radius
    cant see map when create new
    fix player rad
*/

function setup() {
    createMyCanvas()
    background('gray')

    map = makeMap([
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
        [1, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 4, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1],
        [1, 0, 5, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ])

    textures = randomTextures(10, 2)

    let c0 = randomColor()
    let c1 = multClr(c0, 0.2)
    Player.textures = [[
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, c0, c0, c0, c0, -1, -1],
        [-1, -1, c0, c0, c0, c0, -1, -1],
        [-1, -1, c1, c0, c0, c0, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, c0, c0, c0, c0, -1, -1],
    ], [
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, c0, c0, c0, c0, - 1, -1],
        [-1, c1, c0, c0, c0, c0, -1, -1],
        [-1, -1, -1, c0, c0, c0, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, c0, c0, c0, -1, -1, -1],
    ], [
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, c0, c0, c0, c0, - 1, -1],
        [-1, -1, c0, c0, c0, c0, c1, -1],
        [-1, -1, c0, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, -1, -1, -1],
        [-1, -1, -1, c0, c0, c0, -1, -1],
    ], [
        [-1, -1, -1, c1, c1, -1, -1, -1],
        [-1, -1, -1, c1, c1, -1, -1, -1],
        [-1, -1, c1, c1, c1, c1, -1, -1],
        [-1, -1, c1, c1, c1, c1, -1, -1],
        [-1, -1, c1, c1, c1, c1, -1, -1],
        [-1, -1, -1, c1, c1, -1, -1, -1],
        [-1, -1, -1, c1, c1, -1, -1, -1],
        [-1, -1, c1, c1, c1, c1, -1, -1],
    ], [
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, - 1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, c1, c1, -1, -1, -1],
        [-1, -1, c1, c1, c1, c1, -1, -1],
    ]]

    // map = makeMap(0, 16, 16)

    // map = makeMap(
    //     cellularAutomata(
    //         makeMatrix(48, 48, 0.45), 8
    //     )
    // )

    pl0 = new Player(6, 2, -30)
    pl1 = new Player(8.5, 3.5, 180 - 30)
    for (let i = 0; i < 4; i++) new Player()
    fov = 90
    res = width / 4
    mapZoomed = false
    fitMap()
    mapOff = getMapOff()
    drawOff = getDrawMapOff()
    ceilClr = 'lightBlue'
    floorClr = 'lightGreen'
    placeTxtrNum = 0

    renderMap = false
    renderView = true
    pointerLock = false
}


function draw() {
    rayBuf = castRays(pl0.pos, pl0.ang, res)
    if (renderView) drawView(pl0.pos, rayBuf)
    if (renderMap) drawMap(pl0.pos, rayBuf)
    fill(0, 127)
    if (!pl0.alive) rect(0, 0, width, height)
    pl0.move(87, 65, 83, 68)
}

class Sprite {
    constructor(x, y, texture) {
        this.pos = { x, y }
        this.visible = true
        this.texture = texture
        Sprite.all.push(this)
    }

    static all = []

    static castAll(wallDst, i) {
        Sprite.all.filter(s => s.visible)
            .map(s => ({ s, its: s.castRaySprt(pl0, rayBuf[i].ang) }))
            .filter(e => e.its != undefined && e.its.dst < wallDst && e.s.me != true)
            .sort((a, b) => b.its.dst - a.its.dst)
            .forEach(e => {
                let hPlr = calcColHeight(e.its)
                drawTextureCol(e.its, i, hPlr, pxl, e.s.texture)
            });
    }

    castRaySprt(pl0, rayAng = Player.all[0].ang) {
        let dx = this.pos.x - pl0.pos.x
        let dy = this.pos.y - pl0.pos.y
        let strghtDst = Math.hypot(dx, dy)

        rayAng = rayAng == undefined ? pl0.ang : normalAng(rayAng)

        let strghtAng = degrees(atan2(-dy, dx))
        strghtAng = normalAng(strghtAng)

        let plrsAng = 180 - this.ang + strghtAng
        plrsAng = normalAng(plrsAng)

        let rayStrghtAng = rayAng - strghtAng
        rayStrghtAng = normalAng(rayStrghtAng)

        let minAng = pl0.ang - fov / 2
        minAng = normalAng(minAng)

        let maxAng = pl0.ang + fov / 2
        maxAng = normalAng(maxAng)

        if (Math.abs(rayStrghtAng) > fov / 2) return

        let sOff = Math.tan(radians(rayStrghtAng)) * strghtDst

        if (Math.abs(sOff) > Player.rad * 2) return

        let rayDst = sOff / Math.sin(radians(rayStrghtAng))

        let x = pl0.pos.x + rayDst * Math.cos(radians(rayAng))
        let y = pl0.pos.y - rayDst * Math.sin(radians(rayAng))

        return {
            x, y, ang: rayAng, type: 'sprite',
            txtrOff: 0.5 - sOff,
            dst: rayDst, plrsAng,
            dir: angToDir(rayAng)
        }
    }
}

class Player extends Sprite {
    constructor(x, y, ang = 0, speed = 1) {
        if (x == undefined || y == undefined) {
            let spawned = Player.spawn()
            x = spawned.x
            y = spawned.y
        }
        super(x, y, Player.textures[0])
        this.ang = ang
        this.speed = speed
        this.alive = true
        this.me = Player.all.length == 0
        Player.all.push(this)
    }

    static rad = 1 / 4;

    castRaySprt(pl0, rayAng = Player.all[0].ang) {
        let its = super.castRaySprt(pl0, rayAng)
        if (its != undefined)
            this.updateTexture(its.plrsAng)
        return its
    }

    updateTexture(plrsAng) {
        let txtrSide
        if (!this.alive) {
            txtrSide = 4
        } else if (Math.abs(plrsAng) > 135) {
            txtrSide = 3
        } else if (Math.abs(plrsAng) > 45) {
            txtrSide = plrsAng > 0 ? 1 : 2
        } else {
            txtrSide = 0
        }
        let txtr = Player.textures[txtrSide]
        this.texture = txtr
        return txtr
    }

    static all = []

    shoot() {
        if (!this.alive) return
        let shot = Player.all.filter(p => p != this && p.alive)
            .map(p => ({ p, its: p.castRaySprt(pl0) }))
            .filter(e => e.its != undefined)
            .sort((a, b) => a.its.dst - b.its.dst)[0]
        if (shot != undefined)
            shot.p.alive = false
    }

    rotate() {
        if (!this.alive) return
        this.ang -= normalAng(movedX * deltaTime / 100)
    }

    move(forward, left, back, right) {
        if (!this.alive) return
        let dir = { x: 0, y: 0 }
        let vel = { x: 0, y: 0 }

        if (keyIsDown(forward)) dir.y = -1
        if (keyIsDown(left)) dir.x = -1
        if (keyIsDown(back)) dir.y = 1
        if (keyIsDown(right)) dir.x = 1

        if (dir.y == -1) {
            vel.y += -sin(radians(this.ang))
            vel.x += cos(radians(this.ang))
        }
        if (dir.y == 1) {
            vel.y += sin(radians(this.ang))
            vel.x += -cos(radians(this.ang))
        }
        if (dir.x == -1) {
            vel.y += -cos(radians(this.ang))
            vel.x += -sin(radians(this.ang))
        }
        if (dir.x == 1) {
            vel.y += cos(radians(this.ang))
            vel.x += sin(radians(this.ang))
        }

        dir.x = vel.x
        if (dir.x != 0) dir.x = (dir.x > 0) * 2 - 1
        dir.y = vel.y
        if (dir.y != 0) dir.y = (dir.y > 0) * 2 - 1

        let mag = sqrt(vel.x ** 2 + vel.y ** 2)
        if (mag != 0) {
            vel.x /= mag
            vel.y /= mag
        }

        vel.x *= this.speed
        // vel.x /= deltaTime
        vel.y *= this.speed
        // vel.y /= deltaTime


        if (keyIsDown(SHIFT)) {
            vel.x *= 2
            vel.y *= 2
        }

        this.pos.x += vel.x / 20
        this.pos.y += vel.y / 20

        // collision

        let cell, cellValue

        cell = getCell(this.pos.x, this.pos.y + dir.y * Player.rad, false)
        cellValue = getCellVal(cell)
        if (cellValue != 0 || cellValue == undefined) {
            this.pos.y = cell.y + 0.5 - dir.y * 0.5 - dir.y * Player.rad
        }

        cell = getCell(this.pos.x + dir.x * Player.rad, this.pos.y, false)
        cellValue = getCellVal(cell)
        if (cellValue != 0 || cellValue == undefined) {
            this.pos.x = cell.x + 0.5 - dir.x * 0.5 - dir.x * Player.rad
        }
    }

    static spawn() {
        let spaces = copyMatrix(map)
        for (let i = 0; i < spaces.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                let ri = Math.floor(Math.random() * spaces.length)
                let rj = Math.floor(Math.random() * spaces.length)
                spaces[i][j] = { i: ri, j: rj }
                spaces[ri][rj] = { i: i, j: j }
            }
        }

        for (let i = 0; i < spaces.length; i++) {
            for (let j = 0; j < spaces[0].length; j++) {
                const c = spaces[i][j]
                if (map[c.i][c.j] == 0) {
                    return { y: 0.5 + c.i, x: 0.5 + c.j }
                }
            }
        }
        return { x: 0.5 + map.length / 2 + 0.5, y: 0.5 + map[0].length / 2 }
    }
}


// other functions

function normalAng(ang) {
    if (ang > 180)
        return ang - 360
    if (ang < -180)
        return ang + 360
    return ang
}

function drawView(pos, rayBuf) {
    noStroke()
    push()
    fill(ceilClr)
    rect(0, 0, width, height / 2)
    fill(floorClr)
    rect(0, height / 2, width, height / 2)
    pop()

    rayBuf.forEach((its, i) => {
        let h = calcColHeight(its)
        drawTextureCol(its, i, h, pxl, textures[its.val])
        Sprite.castAll(its.dst, i)
    })

    push()
    let r = width / 100
    stroke(0)
    strokeWeight(r / 4)
    fill(255)
    rectMode(CENTER)
    square(width / 2, height / 2, r)
    pop()
}

function calcColHeight(its) {
    let p = its.dst * cos(radians(pl0.ang - its.ang))
    let h = height / p
    pxl = width / res
    h = round(h / pxl) * pxl
    return h
}

function fitMap() { // should depend on resolution
    cls = height / mRows
}

function getDrawMapOff() {
    if (cls * mCols > width || cls * mRows > height) {
        return {
            x: mapOff.x - (pl0.pos.x - mCols / 2) * cls,
            y: mapOff.y - (pl0.pos.y - mRows / 2) * cls
        }
    } else return { x: mapOff.x, y: mapOff.y }
}
function getMapOff() {
    return {
        x: (width - mCols * cls) / 2,
        y: (height - mRows * cls) / 2
    }
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
        mx > 0 && mx < mCols * cls &&
        my > 0 && my < mRows * cls
    )
}

function renderMode(opt = 1) {
    if (opt == 1) {
        renderMap = false
        canRotate = canMove = true
        pointerLock = true
        requestPointerLock()
    } else if (opt == 2) {
        renderMap = true
        canMove = false
        canRotate = false
        pointerLock = false
        exitPointerLock()
    }
}

// texture functions

function multClr(color, m = 1) {
    let clr = Array.from(color)
    for (let i = 0; i < clr.length; i++) {
        clr[i] *= m
        clr[i] = floor(clr[i])
    }
    return clr
}

function randomTextures(n, r, c) {
    let arr = []
    for (let i = 0; i < n; i++)
        arr.push(randomTexture(r, c))
    return arr
}

function randomTexture(r, c) {
    let mtrx = makeMatrix(r, c)
    if (c == undefined) {
        let clr = []
        for (let i = 0; i < r; i++) {
            clr.push(randomColor())
        }
        for (let i = 0; i < r; i++)
            for (let j = 0; j < r; j++)
                mtrx[i][j] = clr[(i + j) % clr.length]
    } else {
        for (let i = 0; i < r; i++)
            for (let j = 0; j < c; j++)
                mtrx[i][j] = randomColor()
    }
    return mtrx
}

function randomColor() {
    return [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
    ]
}


// Input functions

function mouseWheel(event) {
    let scroll = event.delta < 0
    if (scroll) cls *= 1.1
    else cls /= 1.1

    mapZoomed = cls * mCols > width || cls * mRows > height
    if (!mapZoomed) fitMap()

    mapOff = getMapOff()
    drawOff = getDrawMapOff()
    return false;
}

function setKeyNum(kc) {
    let kn = kc - 48
    if (kn < 0 || kn > textures.length) {
        placeTxtrNum = 0
    } else {
        placeTxtrNum = kn
    }
}

function keyPressed() {
    setKeyNum(keyCode)

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
            updateMouse()
            let cell = getCell(mx, my)
            placeCell(map, cell, placeTxtrNum)
        } else {
            renderMode(1)
        }
    } else if (renderView) {
        if (pointerLock) pl0.shoot()
        renderMode(1)
    }
}

function mouseMoved() {
    updateMouse()
    if (canMove) pl0.rotate()
    if (renderMap) {
        pl1.ang = 180 - degrees(atan2(
            pl1.pos.y * cls + drawOff.y - mouseY,
            pl1.pos.x * cls + drawOff.x - mouseX
        ))
        pl1.ang = normalAng(pl1.ang)
    }
}

function mouseDragged() {
    if (renderMap)
        placeCell(map, getCell(mx, my), placeTxtrNum)
}


// Update functions

function updateMouse() {
    mx = mouseX - mapOff.x
    my = mouseY - mapOff.y
    if (mapZoomed) {
        mx += (pl0.pos.x - mCols / 2) * cls
        my += (pl0.pos.y - mRows / 2) * cls
    }
}

function placeCell(mtrx, cell, val = 0) {
    if (cell != undefined) mtrx[cell.y][cell.x] = val
}


// Draw functions

function drawTextureCol(its, i, h, w, txtr) {
    let txtrOff = its.txtrOff
        || getTxtrOff(its, its.side, its.dir)

    let rows = txtr.length
    let cols = txtr[0].length
    let wcHeight = h / rows

    for (let y = 0; y < rows; y++) {
        let x = floor(txtrOff * cols)
        let color = txtr[y][x]
        if (color < 0) continue
        if (its.side == 'y')
            color = multClr(color, 0.8)
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
    drawOff = getDrawMapOff()
    translate(drawOff.x, drawOff.y)
    stroke(127)
    strokeWeight(cls / 16)
    drawMatrix(map, 0.8)

    noStroke()
    fill('gray')
    circle(pos.x * cls, pos.y * cls, cls)
    fill('black')
    circle(pos.x * cls, pos.y * cls, cls * 2 * Player.rad)
    // other player (pl1.pos)
    fill('gray')
    circle(pl1.pos.x * cls, pl1.pos.y * cls, cls)
    fill('black')
    circle(pl1.pos.x * cls, pl1.pos.y * cls, cls * 2 * Player.rad)
    stroke('purple')
    let l = Player.rad * 4 * cls
    line(pl1.pos.x * cls, pl1.pos.y * cls,
        pl1.pos.x * cls + l * Math.cos(radians(pl1.ang)),
        pl1.pos.y * cls - l * Math.sin(radians(pl1.ang)))
    // join plrs
    stroke('green')
    strokeWeight(4)
    line(pos.x * cls, pos.y * cls, pl1.pos.x * cls, pl1.pos.y * cls)

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
    let xMin = 0
    let xMax = mtrx[0].length
    if (drawOff.x < 0) xMin -= floor(drawOff.x / cls) + 1
    let rightOff = drawOff.x + cls * mCols - width
    xMax -= floor(rightOff / cls)
    if (xMax > mtrx[0].length) xMax = mtrx[0].length

    let yMin = 0
    let yMax = mtrx.length
    if (drawOff.y < 0) yMin -= floor(drawOff.y / cls) + 1
    let bottomOff = drawOff.y + cls * mRows - height
    yMax -= floor(bottomOff / cls)
    if (yMax > mtrx[0].length) yMax = mtrx.length

    for (let i = yMin; i < yMax; i++) {
        for (let j = xMin; j < xMax; j++) {
            drawCell(mtrx, i, j, t)
        }
    }
}

function drawCell(mtrx, i, j, t = 1) {
    mtrx[i][j] == 0 ? fill(255, 255 * t) : fill(0, 255 * t)
    rect(j * cls, i * cls, cls, cls)
}


// Ray casting functions

function castRays(pos, offAng, r = width) {
    res = r
    rayBuf = []
    let inc = fov / res
    for (let ang = offAng - fov / 2; ang < offAng + fov / 2; ang += inc) {
        let its = castRay(pos, ang)
        rayBuf.unshift(its)
    }
    return rayBuf
}

function getTxtrOff(its, side, dir) {
    if (side == 'x') {
        if (dir.x > 0) {
            return its.y % 1
        } else {
            return (mRows - its.y) % 1
        }
    } else if (side == 'y') {
        if (dir.y < 0) {
            return its.x % 1
        } else {
            return (mCols - its.x) % 1
        }
    }
}

function castRay(pos, ang) {
    let cell = { x: Math.floor(pos.x), y: Math.floor(pos.y) }
    let off = { x: pos.x - cell.x, y: pos.y - cell.y }
    let dir = angToDir(ang)
    let tg = abs(tan(radians(ang)))
    let ctg = 1 / tg
    let xsi = { x: pos.x - off.x + (1 + dir.x) / 2, }
    xsi.y = pos.y + abs(xsi.x - pos.x) * tg * dir.y
    let ysi = { y: pos.y - off.y + (1 + dir.y) / 2 }
    ysi.x = pos.x + abs(ysi.y - pos.y) * ctg * dir.x
    let dx = ctg * dir.x
    let dy = tg * dir.y

    while (true) {
        while (abs(pos.x - xsi.x) <= abs(pos.x - ysi.x)) {
            cell.x += dir.x
            if (map[cell.y] == undefined
                || map[cell.y][cell.x] != 0) {
                return {
                    dst: Math.hypot(pos.x - xsi.x, pos.y - xsi.y),
                    x: xsi.x, y: xsi.y,
                    side: 'x', ang, dir,
                    val: map[cell.y] != undefined
                        && map[cell.y][cell.x] != undefined
                        ? map[cell.y][cell.x] : 0
                }
            }
            xsi.x += dir.x
            xsi.y += dy
        }
        while (abs(pos.y - ysi.y) <= abs(pos.y - xsi.y)) {
            cell.y += dir.y
            if (map[cell.y] == undefined
                || map[cell.y][cell.x] != 0) {
                return {
                    dst: Math.hypot(pos.x - ysi.x, pos.y - ysi.y),
                    x: ysi.x, y: ysi.y,
                    side: 'y', ang, dir,
                    val: map[cell.y] != undefined
                        && map[cell.y][cell.x] != undefined
                        ? map[cell.y][cell.x] : 0
                }
            }
            ysi.x += dx
            ysi.y += dir.y
        }
    }
}

function angToDir(ang) {
    let y = Math.floor(ang / 180) % 2 ? 1 : -1
    let x = Math.floor((ang - 90) / 180) % 2 ? 1 : -1
    return { x, y }
}

// Cellular automata functions

function cellularAutomata(arr, times = 1) {
    let check = copyMatrix(arr)
    let out = copyMatrix(arr)
    for (let cycle = 0; cycle < times; cycle++) {
        for (let i = 0; i < out.length; i++) {
            for (let j = 0; j < out[0].length; j++) {
                let count = countWallNeighbors(check, i, j)
                if (count > 4) {
                    out[i][j] = 1
                } else if (count < 4) {
                    out[i][j] = 0
                }
            }
        }
        check = copyMatrix(out)
    }
    return out
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
    return { x, y }
}

function getCellVal(cell) {
    if (map[cell.y] == undefined) return undefined
    return map[cell.y][cell.x]
}

function makeMap(arr = 0, r, c) {
    let mtrx = []
    if (arr == 0) {
        mtrx = makeMatrix(r, c, 0)
    } else mtrx = arr
    mRows = mtrx.length
    mCols = mtrx[0].length
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

function copyMatrix(mtrx) {
    let out = []
    for (let i = 0; i < mtrx.length; i++)
        out[i] = Array.from(mtrx[i])
    return out
}