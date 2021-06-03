function multColor(color, mult) {
    if (color == -1) return color;
    if (color[0] == '#') color = hexToRgb(color)
    color = color.map((color, i) => i < 3 ? color * mult : color);
    return color;
}

function hexToRgb(hex) {
    let color = hex.slice(1);
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    return [red, green, blue];
}

function rgbToHex(rgb) {
    if (rgb?.[3] == 0) return -1;
    if (rgb.length > 3) rgb = rgb.slice(0, 3);
    return rgb.reduce((acc, cur) => acc + cur
        .toString(16).padStart(2, 0), '#')
}

function rgbTxtrToHex(texture) {
    return texture.map(row => row
        .map(color => rgbToHex(color)));
}

function randomTextures(n, r, c) {
    let arr = []
    for (let i = 0; i < n; i++)
        arr.push(randomTexture(r, c))
    return arr
}

function randomTexture(r, c) {
    let mtrx = makeMatrix(r, c)
    if (c === undefined) {
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
    let rgb = Array(3).fill().map(() =>
        Math.floor(Math.random() * 256));
    return rgbToHex(rgb);
}