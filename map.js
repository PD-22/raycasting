function fitMap() { // fix...
    if (height < width) {
        cls = height / mapHeight;
    } else {
        cls = width / mapWidth;
    }
}

function getDrawMapOff() {
    if (floor(cls * mapWidth) > width ||
        floor(cls * mapHeight) > height) {
        return {
            x: mapOff.x - (pl0.pos.x - mapWidth / 2) * cls,
            y: mapOff.y - (pl0.pos.y - mapHeight / 2) * cls
        }
    } else return { x: mapOff.x, y: mapOff.y }
}
function getMapOff() {
    return {
        x: (width - mapWidth * cls) / 2,
        y: (height - mapHeight * cls) / 2
    }
}

function drawMap(rayBuf) {
    push()
    drawOff = getDrawMapOff()
    translate(drawOff.x, drawOff.y)
    // stroke(127)
    // strokeWeight(cls / 16)
    drawMatrix(worldMap, 0.8)

    // draw Players
    Player.all.forEach(p => {
        let { pos, ang } = p;
        noStroke()
        fill(127, 127)
        circle(pos.x * cls, pos.y * cls, cls)
        fill(0, 222)
        circle(pos.x * cls, pos.y * cls, cls * 2 * p.rad)
        stroke(127, 0, 127, 200)
        let l = cls / 2
        line(pos.x * cls, pos.y * cls,
            pos.x * cls + l * Math.cos(radians(ang)),
            pos.y * cls - l * Math.sin(radians(ang)))
    })

    // draw view rays
    let drawRay = i => {
        let { pos } = Player.me;
        stroke(255, 0, 0, 222)
        strokeWeight(cls / 32)
        let ray = rayBuf[Math.floor(i)];
        ray = ray[ray.length - 1];
        line(pos.x * cls, pos.y * cls, ray.x * cls, ray.y * cls)
        noStroke()
        fill(255, 255, 0, 222)
        circle(ray.x * cls, ray.y * cls, cls / 12)
    }
    if (mapRayNum <= 1) drawRay(rayBuf.length / 2);
    else {
        let inc = (rayBuf.length - 1) / (mapRayNum - 1);
        for (let i = 0; i < rayBuf.length; i += inc) drawRay(i);
    }

    pop()
}

function drawMatrix(mtrx, t = 1) {
    let xMin = 0
    let xMax = mtrx[0].length
    if (drawOff.x < 0) xMin -= floor(drawOff.x / cls) + 1
    let rightOff = drawOff.x + cls * mapWidth - width
    xMax -= floor(rightOff / cls)
    if (xMax > mtrx[0].length) xMax = mtrx[0].length

    let yMin = 0
    let yMax = mtrx.length
    if (drawOff.y < 0) yMin -= floor(drawOff.y / cls) + 1
    let bottomOff = drawOff.y + cls * mapHeight - height
    yMax -= floor(bottomOff / cls)
    if (yMax > mtrx.length) yMax = mtrx.length

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