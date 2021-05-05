function cellularAutomata(arr, times = 1) {
    let check = copyMatrix(arr)
    let out = copyMatrix(arr)
    for (let cycle = 0; cycle < times; cycle++) {
        for (let i = 0; i < out.length; i++) {
            for (let j = 0; j < out[0].length; j++) {
                let count = countWallNeighbors(check, i, j)
                if (count > 4) {
                    out[i][j] = 1
                } else if (count < 4) {
                    out[i][j] = 0
                }
            }
        }
        check = copyMatrix(out)
    }
    return out
}

function countWallNeighbors(arr, i, j) {
    let count = 0
    for (let k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= arr.length) {
            count += 3
            continue
        }
        for (let l = j - 1; l <= j + 1; l++) {
            if (k - i == 0 && l - j == 0) continue
            if (l < 0 || l >= arr[0].length) {
                count++
                continue
            }
            if (arr[k][l] == 1) {
                count++
            }
        }
    }
    return count
}