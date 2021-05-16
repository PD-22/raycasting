function multColor(hexColor, m) {
    let rgb = hexToRgb(hexColor);
    let newRgb = rgb.map(color => {
        let newColor = Math.round(color * m);
        if (newColor > 255) newColor = 255;
        return newColor
    });
    return rgbToHex(newRgb);
}

function hexToRgb(hex) {
    let color = hex.slice(1);
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);
    return [red, green, blue];
}

function rgbToHex(rgb) {
    rgb = rgb.slice(0, 3);
    let colorToHex = num => num
        .toString(16).padStart(2, 0);
    return `#${rgb.map(colorToHex).join('')}`;
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