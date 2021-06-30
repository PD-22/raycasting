function logStats() {
    push();
    noStroke();
    fill(0, 200);
    debugLogs['FPS'] = Math.round(1000 / deltaTime);
    debugLogs['PPF'] = numberWithCommas(pixelCount);
    let logs = Object.entries(debugLogs).reverse();
    let logWidth = 90;
    ctx.textBaseline = 'middle';
    rect(0, 0, logWidth, logs.length * 20 + 10);
    logs.forEach(([key, val], i) => {
        if (typeof val == 'number')
            val = Math.round(val.toFixed(2));
        fill('white');
        text(`${key}: ${val}`, 10, i * 20 + 10);

        if (key == 'PPF') return;
        if (key == 'FPS') {
            if (val <= 30) {
                fill(255, 0, 0, 200);
                rect(0, i * 20, logWidth, 20);
            }
            return;
        }

        if (val < 1000 / 60)
            fill(0, 255, 0, 200);
        else if (val < 2 * 1000 / 60)
            fill(255, 0, 0, 200);
        else
            fill(255, 255, 0, 200);
        rect(0, i * 20, val % logWidth, 20);
    });
    pop();
}

function numberWithCommas(number) {
    return number?.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function myLog(name, cb_value) {
    let value = cb_value;
    if (cb_value instanceof Function) {
        let start = Date.now();
        cb_value();
        let end = Date.now() - start;
        value = end;
    }
    debugLogs[name] = value;
}

function myLogMany(logs) {
    let entries = Object.entries(logs)
    for (let [key, val] of entries)
        myLog(key, val);
}