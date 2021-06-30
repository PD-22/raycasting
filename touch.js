let sPosLeft;
let pPosLeft;
let dPosLeft;

let sPosRight;
let pPosRight;
let dPosRight;

let canvasOffset;

function fixPos(pos) {
    return {
        x: pos.x - canvasOffset.x,
        y: pos.y - canvasOffset.y
    }
}

function touchStarted(e) {
    getTouchPos(e).forEach(pos => {
        pos = fixPos(pos);

        if (pos.x < width / 2) {
            if (sPosLeft == undefined)
                sPosLeft = pPosLeft = pos;
        } else {
            if (sPosRight == undefined)
                sPosRight = pPosRight = pos;
        }
    })
}

function touchMoved(e) {
    getTouchPos(e).forEach(pos => {
        pos = fixPos(pos);

        if (pos.x < width / 2) {
            if (sPosLeft == undefined)
                sPosLeft = pPosLeft = pos;
            dPosLeft = {
                x: pos.x - pPosLeft.x,
                y: pos.y - pPosLeft.y
            };
            pPosLeft = pos;
        } else {
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
    getChangedTouchPos(e).forEach(pos => {
        pos = fixPos(pos);

        if (pos.x < width / 2) {
            sPosLeft = pPosLeft = dPosLeft = undefined;
        } else {
            sPosRight = pPosRight = dPosRight = undefined;
        }
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
        ctx.fillText(`${x} ${y}`, 0, 0);

        ctx.fillStyle = 'darkRed';
        circle(sPosLeft.x, sPosLeft.y, 10);

        ctx.fillStyle = 'red';
        circle(pPosLeft.x, pPosLeft.y, 10);
    }

    if (dPosRight != undefined) {
        let x = (dPosRight.x).toFixed(0);
        let y = (dPosRight.y).toFixed(0);

        ctx.fillStyle = 'white';
        ctx.fillText(`${x} ${y}`, width / 2, 0);

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