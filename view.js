function drawView() {
    displayBuf = updateDisplayBuf();
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

function updateDisplayBuf() {
    let copyDisplayBuf = displayBuf.map(row => [...row]);

    let floatFix = float =>
        1 - (float % 1) < 1e-15 ?
            Math.ceil(float) : float;

    for (let x = 0; x < displayWidth; x++) {
        let ray = rayBuf[x];
        let lineHeight = calcLineHeight(ray);

        let texture = wallTextures[ray.val];
        let txtrHeight = texture.length;
        let txtrWidth = texture[0].length;
        let txtrOff = getTxtrOff(ray);
        let txtrX = Math.floor(txtrOff * txtrWidth);

        let lineStart = (displayHeight - lineHeight) / 2;
        let lineEnd = (displayHeight + lineHeight) / 2;

        for (let y = 0; y < displayHeight; y++) {
            let color;
            if (y >= lineStart && y < lineEnd) {
                let deltaY = y - lineStart;
                let lineTxtrRatio = txtrHeight / lineHeight;
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

function calcLineHeight(its) {
    let p = its.dst * cos(radians(pl0.ang - its.ang));
    return displayHeight / p;
}

function makeDisplayBuf() {
    let rows = displayWidth / 16 * 9;
    rows = Math.floor(rows);
    displayBuf = Array(rows).fill()
        .map(() => Array(displayWidth).fill()
            .map(() => randomColor()));
}

function getTxtrOff({ side, dir, x, y }) {
    if (side == 'x') {
        if (dir.x > 0) return y % 1;
        else return (displayHeight - y) % 1;
    } else if (side == 'y')
        if (dir.y < 0) return x % 1;
        else return (displayWidth - x) % 1;
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