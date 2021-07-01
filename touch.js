let touch_mouse;

let startPosLeft;
let prevPosLeft;
let deltPosLeft;
let leftIndex;

let startPosRight;
let prevPosRight;
let deltPosRight;
let rightIndex;

let canvasOffset;

function fixPos(pos) {
    return {
        x: pos.x - canvasOffset.x,
        y: pos.y - canvasOffset.y
    }
}

let lastTouch;
function touchStarted(e) {
    if (lastTouch != undefined && Date.now() - lastTouch < 150)
        document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    lastTouch = Date.now();

    getTouchPos(e).forEach((pos, i) => {
        pos = fixPos(pos);

        if (pos.x < width / 2) {
            leftIndex = Array.from(e.touches)[i].identifier;
            rightIndex = leftIndex == 0 ? 1 : 0;
            if (startPosLeft == undefined)
                startPosLeft = prevPosLeft = pos;
        } else {
            rightIndex = Array.from(e.touches)[i].identifier;
            leftIndex = rightIndex == 0 ? 1 : 0;
            if (startPosRight == undefined)
                startPosRight = prevPosRight = pos;
        }
    })
}

function touchMoved(e) {
    getTouchPos(e).forEach((pos, i) => {
        pos = fixPos(pos);

        if (pos.x < width / 2) {
            let { identifier } = Array.from(e.touches)[i];
            if (identifier != leftIndex) return;
            if (startPosLeft == undefined)
                startPosLeft = prevPosLeft = pos;
            deltPosLeft = {
                x: pos.x - prevPosLeft.x,
                y: pos.y - prevPosLeft.y
            };
            lastPosLeft = pos;
            prevPosLeft = pos;
        } else {
            let { identifier } = Array.from(e.touches)[i];
            if (identifier != rightIndex) return;
            if (startPosRight == undefined)
                startPosRight = prevPosRight = pos;
            deltPosRight = {
                x: pos.x - prevPosRight?.x,
                y: pos.y - prevPosRight?.y
            };
            prevPosRight = pos;
        }
    })
}

function touchEnded(e) {
    getChangedTouchPos(e).forEach((pos, i) => {
        pos = fixPos(pos);

        let { identifier } = Array.from(e.changedTouches)[i];
        if (identifier == leftIndex)
            startPosLeft = prevPosLeft = deltPosLeft = undefined;
        if (identifier == rightIndex)
            startPosRight = prevPosRight = deltPosRight = undefined;
    })
}

function touchPressed(e) {
    let pos = getChangedTouchPos(e)[0];
    let { x, y } = fixPos(pos);
    mouseX = x;
    mouseY = y;
    touch_mouse = 'touch';
    mousePressed();
}

function drawTouch() {
    ctx.save();

    ctx.font = '16px arial';
    ctx.textBaseline = 'top';


    if (deltPosLeft != undefined) {
        let x = (deltPosLeft.x).toFixed(1);
        let y = (deltPosLeft.y).toFixed(1);

        ctx.fillStyle = 'white';
        ctx.fillText(`x:${x} y:${y} i:${leftIndex}`, 0, 0);

        ctx.fillStyle = 'darkRed';
        circle(startPosLeft.x, startPosLeft.y, 10);

        ctx.fillStyle = 'red';
        circle(prevPosLeft.x, prevPosLeft.y, 10);
    }

    if (deltPosRight != undefined) {
        let x = (deltPosRight.x).toFixed(1);
        let y = (deltPosRight.y).toFixed(1);

        ctx.fillStyle = 'white';
        ctx.fillText(`x:${x} y:${y} i:${rightIndex}`, width / 2, 0);

        if (startPosRight != undefined) {
            ctx.fillStyle = 'darkGreen';
            circle(startPosRight.x, startPosRight.y, 10);

            ctx.fillStyle = 'green';
            circle(prevPosRight.x, prevPosRight.y, 10);
        }
    }

    ctx.restore();
}

function getChangedTouchPos(e) {
    return Array.from(e.changedTouches)
        .map(touch => ({
            x: touch.pageX,
            y: touch.pageY
        }))
}

function getTouchPos(e) {
    return Array.from(e.touches)
        .map(touch => ({
            x: touch.pageX,
            y: touch.pageY
        }))
}