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
        drawTextureCol(its, i, h, pxl, wallTextures[its.val])
        Sprite.castAll(its.dst, i)
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
    let h = height / p
    pxl = width / res
    h = round(h / pxl) * pxl
    return h
}

function drawTextureCol(its, i, h, w, txtr) {
    let txtrOff = its.txtrOff
        || getTxtrOff(its, its.side, its.dir)

    if (txtrOff >= 1) txtrOff %= 1;

    let rows = txtr.length
    let cols = txtr[0].length
    let wcHeight = h / rows

    for (let y = 0; y < rows; y++) {
        let x = floor(txtrOff * cols)
        // debbugger got txtrOff = 1 (length)
        let color = txtr[y][x]
        if (color < 0) continue
        if (its.side != undefined && its.side == 'y')
            color = multClr(color, 0.8)
        fill(color)
        rect(
            Math.round(i * w),
            (height - h) / 2 + wcHeight * y,
            w, wcHeight
        )
    }
}