function drawView() {
    if (!stopRender)
        time('rndr', () => renderDisplay());
    time('draw', () => drawDisplay(displayBuf));
}

function renderDisplay() {
    for (let x = 0; x < displayWidth; x++) {
        let rays = rayBuf[x];
        renderRays(rays, x);
    }
    renderGun();
}

function renderGun() {
    let gunTex = gunTexs[Math.floor(pl0.gunAnimIndex)];

    let texRows = gunTex.length;
    let texCols = gunTex[0].length;

    let xOff = (displayWidth - texCols) / 2;
    xOff = Math.floor(xOff);
    let yOff = displayHeight - texRows;

    for (let y = 0; y < texRows; y++) {
        for (let x = 0; x < texCols; x++) {
            let clr = gunTex[y][x];
            if (clr == -1) continue;
            displayBuf[y + yOff][x + xOff] = clr;
        }
    }
}

function renderRays(rayArr, x) {
    for (let i = 0; i < rayArr.length; i++) {
        let ray = rayArr[i];

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
                if (i != 0) continue;
                color = y < displayHeight / 2 ?
                    ceilClr : floorClr;
            } else {
                let deltaY = y - lineStart;
                let txtrY = deltaY * lineTxtrRatio;
                txtrY = Math.floor(floatFix(txtrY)) || 0; // fix me
                color = texture[txtrY][txtrX];
                let hasAlpha = Array.isArray(color)
                    && color[3] != 255;
                if (color == -1 || hasAlpha) continue;
                if (ray?.side == 'y')
                    color = multColor(color, 0.75);
            }
            displayBuf[y][x] = color;
        }
    }
}

// fixes 0.(9)
function floatFix(float) {
    if (1 - (float % 1) < 1e-9)
        return Math.ceil(float);
    return float
}

function drawDisplay() {
    pixelCount = 0;
    let imageData = ctx.createImageData(
        displayWidth * dScale,
        displayHeight * dScale
    );
    for (let y = 0; y < displayHeight; y++) {
        for (let x = 0; x < displayWidth; x++) {
            let color = displayBuf[y][x];
            if (!pl0.alive) color = multColor(color, 1 / 4);
            if (color[0] == '#') color = hexToRgb(color);
            color[3] ??= 255;
            // if (!redraw && prevDisplayBuf?.[y][x] == color) color[3] = 0;
            prevDisplayBuf[y][x] = color;
            for (let j = 0; j < dScale; j++) {
                for (let k = 0; k < dScale; k++) {
                    let i = 4 * ((y * dScale + j) * displayWidth * dScale + x * dScale + k);
                    imageData.data[i] = color[0];
                    imageData.data[i + 1] = color[1];
                    imageData.data[i + 2] = color[2];
                    imageData.data[i + 3] = color[3];
                    pixelCount++;
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    redraw = false
}

function makeDisplayBuf(callback = () => -1) {
    let rows = displayWidth / 16 * 9;
    rows = Math.floor(rows);
    displayBuf = Array(rows).fill()
        .map((_, y) => Array(displayWidth).fill()
            .map((_, x) => callback(x, y)));
    prevDisplayBuf = displayBuf.map(row => [...row]);
}