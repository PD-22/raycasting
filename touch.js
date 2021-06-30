let sPosLeft;
let pPosLeft;
let dPosLeft;
let leftIndex;

let sPosRight;
let pPosRight;
let dPosRight;
let rightIndex;

let canvasOffset;

function fixPos(pos) {
    return {
        x: pos.x - canvasOffset.x,
        y: pos.y - canvasOffset.y
    }
}

function touchStarted(e) {
    getTouchPos(e).forEach((pos, i) => {
        pos = fixPos(pos);

        if (pos.x < width / 2) {
            leftIndex = Array.from(e.touches)[i].identifier;
            rightIndex = leftIndex == 0 ? 1 : 0;
            if (sPosLeft == undefined)
                sPosLeft = pPosLeft = pos;
        } else {
            rightIndex = Array.from(e.touches)[i].identifier;
            leftIndex = rightIndex == 0 ? 1 : 0;
            if (sPosRight == undefined)
                sPosRight = pPosRight = pos;
        }
    })
}

function touchMoved(e) {
    getTouchPos(e).forEach((pos, i) => {
        pos = fixPos(pos);

        if (pos.x < width / 2) {
            let { identifier } = Array.from(e.touches)[i];
            if (identifier != leftIndex) return;
            if (sPosLeft == undefined)
                sPosLeft = pPosLeft = pos;
            dPosLeft = {
                x: pos.x - pPosLeft.x,
                y: pos.y - pPosLeft.y
            };
            pPosLeft = pos;
        } else {
            let { identifier } = Array.from(e.touches)[i];
            if (identifier != rightIndex) return;
            if (sPosRight == undefined)
                sPosRight = pPosRight = pos;
            dPosRight = {
                x: pos.x - pPosRight?.x,
                y: pos.y - pPosRight?.y
            };
            pPosRight = pos;
        }
    })
}

function touchEnded(e) {
    getChangedTouchPos(e).forEach((pos, i) => {
        pos = fixPos(pos);

        let { identifier } = Array.from(e.changedTouches)[i];
        if (identifier == leftIndex)
            sPosLeft = pPosLeft = dPosLeft = undefined;
        if (identifier == rightIndex)
            sPosRight = pPosRight = dPosRight = undefined;
    })
}

function drawTouch() {
    ctx.save();

    ctx.font = '16px arial';
    ctx.textBaseline = 'top';


    if (dPosLeft != undefined) {
        let x = (dPosLeft.x).toFixed(0);
        let y = (dPosLeft.y).toFixed(0);

        ctx.fillStyle = 'white';
        ctx.fillText(`x:${x} y:${y} i:${leftIndex}`, 0, 0);

        ctx.fillStyle = 'darkRed';
        circle(sPosLeft.x, sPosLeft.y, 10);

        ctx.fillStyle = 'red';
        circle(pPosLeft.x, pPosLeft.y, 10);
    }

    if (dPosRight != undefined) {
        let x = (dPosRight.x).toFixed(0);
        let y = (dPosRight.y).toFixed(0);

        ctx.fillStyle = 'white';
        ctx.fillText(`x:${x} y:${y} i:${rightIndex}`, width / 2, 0);

        if (sPosRight != undefined) {
            ctx.fillStyle = 'darkGreen';
            circle(sPosRight.x, sPosRight.y, 10);

            ctx.fillStyle = 'green';
            circle(pPosRight.x, pPosRight.y, 10);
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