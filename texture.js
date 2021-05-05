function multClr(color, m = 1) {
    let clr = Array.from(color)
    for (let i = 0; i < clr.length; i++) {
        clr[i] *= m
        clr[i] = Math.floor(clr[i])
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