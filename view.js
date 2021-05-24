function drawView() {
    if (!stopRender) renderDisplay();
    drawDisplay(displayBuf);
    // oldDrawView();
}

function oldDrawView() {
    pixelCount = 0;
    drawBackground();
    rayBuf.forEach((its, i) => {
        push()
        noStroke();
        // stroke('purple');
        let h = calcLineHeight(its)
        drawTextureCol(its, i, h, wallTextures[its.val])
        Sprite.castAll(its.dst, i)
        pop()
    })
}

function renderDisplay() {
    let sprites = Sprite.all.filter(p => !p.me && p.visible);

    for (let x = 0; x < displayWidth; x++) {
        rays = [rayBuf[x]];
        rays.push(...getSpriteRays(sprites, x));
        renderRays(rays, x);
    }
}

function getSpriteRays(sprites, x) {
    let ang = rayBuf[x].ang;
    let wallDst = rayBuf[x].dst;

    let rayArr = [];
    sprites.forEach(sprite => {
        let ray = sprite.castRaySprt(pl0, ang);
        if (ray === undefined || ray.dst > wallDst) return;
        let { texture } = sprite;
        rayArr.push({ ...ray, texture });
    });

    return rayArr.sort((a, b) => b.dst - a.dst);
}

function renderRays(rayArr, x) {
    rayArr.forEach((ray, i) => {
        let { lineHeight, texture, txtrOff } = ray;

        let txtrHeight = texture.length;
        let txtrWidth = texture[0].length;

        let lineTxtrRatio = txtrHeight / lineHeight;

        let txtrX = Math.floor(txtrOff * txtrWidth);

        let lineStart = (displayHeight - lineHeight) / 2;
        let lineEnd = (displayHeight + lineHeight) / 2;

        for (let y = 0; y < displayHeight; y++) {
            let color;
            if (y < lineStart || y >= lineEnd) {
                if (i == 0) color =
                    y < displayHeight / 2 ?
                        ceilClr : floorClr;
                else continue;
            } else {
                let deltaY = y - lineStart;
                let txtrY = deltaY * lineTxtrRatio;
                txtrY = Math.floor(floatFix(txtrY));
                color = texture[txtrY][txtrX];
                if (color == -1) continue;
                if (ray?.side == 'y')
                    color = multColor(color, 0.75);
            }
            displayBuf[y][x] = color;
        }
    });
}

// fixes 0.(9)
function floatFix(float) {
    if (1 - (float % 1) < 1e-9)
        return Math.ceil(float);
    return float
}

function drawDisplay() {
    pixelCount = 0;
    push();
    noStroke();
    // stroke('purple'); strokeWeight(0.1);
    scale(Math.floor(displayScale));
    displayBuf.forEach((row, y) => row.forEach((color, x) => {
        if (prevDisplayBuf?.[y][x] == color) return;
        pixelCount++;
        fill(color);
        square(x, y, 1);
    }))
    pop();
    prevDisplayBuf = displayBuf.map(row => [...row]);
}

function makeDisplayBuf() {
    let rows = displayWidth / 16 * 9;
    rows = Math.floor(rows);
    displayBuf = Array(rows).fill()
        .map(() => Array(displayWidth).fill()
            .map(() => randomColor()));
}


// old way methods

function drawBackground() {
    push();
    noStroke();
    fill(ceilClr);
    rect(0, 0, width, height / 2);
    fill(floorClr);
    rect(0, height / 2, width, height);
    pop();
}

function drawTextureCol(its, drawX, lineHeight, texture) {
    let txtrOff = its.txtrOff
        || getTxtrOff(its, its.side, its.dir)

    if (txtrOff >= 1) txtrOff %= 1;

    let txtrHeight = texture.length;
    let txtrWidth = texture[0].length;
    let wcHeight = (lineHeight / txtrHeight)
    push();
    scale(Math.floor(displayScale));
    let txtrX = floor(txtrOff * txtrWidth)
    for (let txtrY = 0; txtrY < txtrHeight; txtrY++) {
        let color = texture[txtrY][txtrX]
        if (color < 0) continue
        pixelCount++;
        if (its.side != undefined && its.side == 'y')
            color = multColor(color, 0.8)
        fill(color)
        let drawY = (displayHeight - lineHeight) / 2 + wcHeight * txtrY;
        if (drawY < -wcHeight || drawY > height) continue
        rect(drawX, drawY, 1, wcHeight);
    }
    pop();
}