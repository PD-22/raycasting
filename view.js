function drawView(rayBuf) {
    // drawBackground();

    displayBuf = updateDisplayBuf();
    drawDisplay(displayBuf);

    // rayBuf.forEach((its, i) => {
    //     push()
    //     // stroke('purple');
    //     let h = calcColHeight(its)
    //     drawTextureCol(its, i, h, wallTextures[its.val])
    //     // Sprite.castAll(its.dst, i)
    //     pop()
    // })
}

let tempStat = 0;

function drawBackground() {
    push();
    fill(ceilClr);
    rect(0, 0, width, height / 2);
    fill(floorClr);
    rect(0, height / 2, width, height);
    pop();
}

function calcColHeight(its) {
    let p = its.dst * cos(radians(pl0.ang - its.ang));
    return displayHeight / p;
}

function makeDisplayBuf() {
    // temp resolution
    let rows = displayWidth / 16 * 9;
    rows = Math.floor(rows);
    displayBuf = Array(rows).fill()
        .map(() => Array(displayWidth).fill()
            .map(() => randomColor()));
}

/* function updateDisplayBuf() {
    return displayBuf.map((row, y) => row.map((color, x) =>
        // color
        Math.random() < 1e-3 ?
            randomColor() : color
    ))
} */

function getTxtrOff(its) {
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

function updateDisplayBuf() {
    let copyDisplayBuf = displayBuf.map(row => [...row]);
    for (let x = 0; x < displayWidth; x++) {
        let ray = rayBuf[x];
        let h = calcColHeight(ray);
        for (let y = 0; y < displayHeight; y++) {
            let color;
            if (y > (displayHeight - h) / 2 &&
                y < (displayHeight + h) / 2) {
                color = '#ff0000';
                if (ray.side == 'y')
                    color = multColor(color, 0.5);
            }
            else color = '#000000';
            copyDisplayBuf[y][x] = color;
        }
    }
    return copyDisplayBuf;
}

function drawDisplay() {
    push();
    noStroke();
    scale(width / displayWidth);
    displayBuf.forEach((row, y) => row.forEach((color, x) => {
        if (previousDisplayBuf?.[y][x] == color) return;
        fill(color);
        square(x, y, 1);
    }))
    pop();
    previousDisplayBuf = displayBuf.map(row => [...row]);
}

/* function drawTextureCol(its, i, h, txtr) {
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
        if (its.side != undefined && its.side == 'y')
            color = multClr(color, 0.8)
        fill(color)
        rect(
            Math.round(i * pxl),
            (height - h) / 2 + wcHeight * y,
            pxl, wcHeight + 0.5
        )
    }
} */

/* function drawTextureCol(its, i, h, txtr) {
    let txtrOff = its.txtrOff
        || getTxtrOff(its, its.side, its.dir)
    txtrOff %= 1;

    let rows = txtr.length
    let cols = txtr[0].length

    let x = floor(txtrOff * cols)

    let yStart = snapGrid((height - h) / 2);
    let yEnd = snapGrid((height + h) / 2);

    for (y = yStart; y < yEnd; y += pxl) {
        let color;
        let yTxtr = Math.floor((y - yStart) * rows / h);
        color = txtr[yTxtr][x];

        if (color < 0) continue
        if (its.side == 'y')
            color = multClr(color, 0.8)

        fill(color)
        rect(
            i * pxl, y,
            pxl, pxl
        );
    }

} */