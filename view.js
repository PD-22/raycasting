function drawView(rayBuf) {
    noStroke()
    push()
    fill(ceilClr)
    rect(0, 0, width, height / 2)
    fill(floorClr)
    rect(0, height / 2, width, height / 2)
    pop()

    rayBuf.forEach((its, i) => {
        push()
        // stroke('purple');
        let h = calcColHeight(its)
        drawTextureCol(its, i, h, wallTextures[its.val])
        // Sprite.castAll(its.dst, i)
        pop()
    })

    // aim dot
    push()
    let r = width / 100
    r -= r / 4 * pl0.aim
    stroke(0)
    strokeWeight(r / 4)
    fill(255)
    rectMode(CENTER)
    square(width / 2, height / 2, r)
    pop()
}

function calcColHeight(its) {
    let p = its.dst * cos(radians(pl0.ang - its.ang))
    let h = snapGrid(height / p);
    return h
}

function drawTextureCol(its, i, h, txtr) {
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
}

// function drawTextureCol(its, i, h, txtr) {
//     let txtrOff = its.txtrOff
//         || getTxtrOff(its, its.side, its.dir)
//     txtrOff %= 1;

//     let rows = txtr.length
//     let cols = txtr[0].length

//     let x = floor(txtrOff * cols)

//     let yStart = snapGrid((height - h) / 2);
//     let yEnd = snapGrid((height + h) / 2);

//     for (y = yStart; y < yEnd; y += pxl) {
//         let color;
//         let yTxtr = Math.floor((y - yStart) * rows / h);
//         color = txtr[yTxtr][x];

//         if (color < 0) continue
//         if (its.side == 'y')
//             color = multClr(color, 0.8)

//         fill(color)
//         rect(
//             i * pxl, y,
//             pxl, pxl
//         );
//     }

// }

function snapGrid(x) { return Math.round(x / pxl) * pxl };