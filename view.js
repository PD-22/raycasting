function drawView() {
    if (stopRender) {
        displayBuf = renderWalls();
        displayBuf = renderSprites();
    }
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

// wall
function renderWalls() {
    let copyDisplayBuf = displayBuf.map(row => [...row]);

    for (let x = 0; x < displayWidth; x++) {
        let ray = rayBuf[x];

        let { lineHeight, texture, txtrOff } = ray;

        let txtrHeight = texture.length;
        let txtrWidth = texture[0].length;

        let lineTxtrRatio = txtrHeight / lineHeight;

        let txtrX = Math.floor(txtrOff * txtrWidth);

        let lineStart = (displayHeight - lineHeight) / 2;
        let lineEnd = (displayHeight + lineHeight) / 2;

        for (let y = 0; y < displayHeight; y++) {
            let color;
            if (y >= lineStart && y < lineEnd) {
                let deltaY = y - lineStart;
                let txtrY = deltaY * lineTxtrRatio;
                txtrY = Math.floor(floatFix(txtrY));
                color = texture[txtrY][txtrX];
                if (ray.side == 'y')
                    color = multColor(color, 0.75);
            } else color = y < displayHeight / 2 ?
                ceilClr : floorClr;
            copyDisplayBuf[y][x] = color;
        }
    }

    return copyDisplayBuf;
}

// sprite
function renderSprites() {
    let copyDisplayBuf = displayBuf.map(row => [...row]);

    let sprites = Sprite.all.filter(p => !p.me && p.visible);

    for (let x = 0; x < displayWidth; x++) {
        let ang = rayBuf[x].ang;
        let wallDst = rayBuf[x].dst;

        let renderRays = [];
        sprites.forEach(sprite => {
            let ray = sprite.castRaySprt(pl0, ang);
            if (ray === undefined || ray.dst > wallDst) return;
            let { texture } = sprite;
            renderRays.push({ ...ray, texture });
        });

        renderRays.sort((a, b) => b.dst - a.dst).forEach(ray => {
            let { lineHeight, texture, txtrOff } = ray;

            let txtrHeight = texture.length;
            let txtrWidth = texture[0].length;

            let lineTxtrRatio = txtrHeight / lineHeight;

            let txtrX = Math.floor(txtrOff * txtrWidth);

            let lineStart = (displayHeight - lineHeight) / 2;
            let lineEnd = (displayHeight + lineHeight) / 2;

            for (let y = 0; y < displayHeight; y++) {
                let color;
                if (y < lineStart || y >= lineEnd) continue;
                let deltaY = y - lineStart;
                let txtrY = deltaY * lineTxtrRatio;
                txtrY = Math.floor(floatFix(txtrY));
                color = texture[txtrY][txtrX];
                if (color == -1) continue;
                copyDisplayBuf[y][x] = color;
            }
        });
    }

    return copyDisplayBuf;
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
        if (previousDisplayBuf?.[y][x] == color) return;
        pixelCount++;
        fill(color);
        square(x, y, 1);
    }))
    pop();
    previousDisplayBuf = displayBuf.map(row => [...row]);
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
    fill(ceilClr);
    rect(0, 0, width, height / 2);
    fill(floorClr);
    rect(0, height / 2, width, height);
    pop();
}

function drawTextureCol(its, i, h, txtr) {
    let pxl = width / displayWidth
    h *= pxl;
    let txtrOff = its.txtrOff
        || getTxtrOff(its, its.side, its.dir)

    if (txtrOff >= 1) txtrOff %= 1;

    let rows = txtr.length
    let cols = txtr[0].length
    let wcHeight = (h / rows)

    let x = floor(txtrOff * cols)
    for (let y = 0; y < rows; y++) {
        let color = txtr[y][x]
        if (color < 0) continue
        pixelCount++;
        if (its.side != undefined && its.side == 'y')
            color = multColor(color, 0.8)
        fill(color)
        rect(
            Math.round(i * pxl),
            (height - h) / 2 + wcHeight * y,
            pxl, wcHeight + 0.5
        )
    }
}