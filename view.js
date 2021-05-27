function drawView() {
    if (!stopRender)
        time('rndr', () => renderDisplay());
    time('draw', () => drawDisplay(displayBuf));
}

function renderDisplay() {
    let sprites = Sprite.all.filter(p => !p.me && p.visible);

    for (let x = 0; x < displayWidth; x++) {
        let rays = [rayBuf[x], ...getSpriteRays(sprites, x)];
        renderRays(rays, x);
    }

    renderGun();
}

function renderGun() {
    if (pl0.shooting) {
        pl0.gunAnimIndex += deltaTime / 120;
        if (pl0.gunAnimIndex > 3) {
            pl0.gunAnimIndex = 0;
            pl0.shooting = false;
        }
    }
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
                txtrY = Math.floor(floatFix(txtrY));
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
    push();
    noStroke();
    // stroke('purple'); strokeWeight(0.1);
    scale(Math.floor(displayScale));
    for (let y = 0; y < displayHeight; y++) {
        for (let x = 0; x < displayWidth; x++) {
            let color = displayBuf[y][x];
            if (!pl0.alive) color
                = multColor(color, 1 / 4);
            if (!redraw && prevDisplayBuf
                ?.[y][x] == color) continue;
            prevDisplayBuf[y][x] = color;
            pixelCount++;
            fill(color);
            square(x, y, 1)
        }
    }
    redraw = false
    pop();
}

function makeDisplayBuf(callback = () => -1) {
    let rows = displayWidth / 16 * 9;
    rows = Math.floor(rows);
    displayBuf = Array(rows).fill()
        .map((_, y) => Array(displayWidth).fill()
            .map((_, x) => callback(x, y)));
    prevDisplayBuf = displayBuf.map(row => [...row]);
}