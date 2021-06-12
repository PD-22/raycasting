// merge getColorStyle

var canvas, ctx, deltaTime,
    requestPointerLock,
    exitPointerLock,
    movedX, movedY,
    mouseX, mouseY,
    mouseButton,
    keyCode;

var draw, setup, keyPressed,
    mousePressed,
    mouseReleased,
    mouseMoved,
    mouseDragged,
    mouseWheel;

var audioContext;
// var audioContext = new AudioContext();

var inputLogger = {};

window.addEventListener('blur', e => {
    for (let key in inputLogger) {
        inputLogger[key] = false;
    }
});

const SHIFT = 16;
const CONTROL = 17;
const ALT = 18;
const SPACE = 32;
const UP_ARROW = 38;
const LEFT_ARROW = 37;
const DOWN_ARROW = 40;
const RIGHT_ARROW = 39;
const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

window.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('keydown', evt => {
        if (audioContext == undefined)
            audioContext = new AudioContext();
        keyCode = evt.keyCode;
        keyPressed?.(keyCode);
        inputLogger[keyCode] = true;
    });
    document.body.addEventListener('keyup', evt => {
        keyCode = evt.keyCode;
        inputLogger[keyCode] = false;
    });
    document.body.addEventListener('mousewheel', evt => mouseWheel?.(evt));
    document.body.addEventListener('mousedown', evt => {
        if (audioContext == undefined)
            audioContext = new AudioContext();

        inputLogger.mouseDown = true;
        mouseButton = evt.button;
        mousePressed?.(evt);
    });
    document.body.addEventListener('mouseup', evt => {
        inputLogger.mouseDown = false;
        mouseButton = evt.button;
        mouseReleased?.(evt);
    });
    document.body.addEventListener('mousemove', evt => {
        let mousePos = getMousePos(canvas, evt);
        mouseX = mousePos.x;
        mouseY = mousePos.y;
        movedX = evt.movementX;
        movedY = evt.movementY;
        mouseMoved?.(evt);
        if (inputLogger.mouseDown)
            mouseDragged?.(evt);
    });
    setup?.();

    (function animate(time, lastTime) {
        if (lastTime != undefined) {
            deltaTime = time - lastTime;
            draw?.();
        }
        requestAnimationFrame(newTime => animate(newTime, time));
    })()

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
});


function createCanvas(width, height) {
    canvas = document.createElement('canvas');
    canvas.className = 'wolf3d';
    canvas.width = width;
    canvas.height = height;
    document.body.append(canvas);

    ctx = canvas.getContext('2d');
    ctx.noStroke = true;

    requestPointerLock = () => canvas.requestPointerLock();
    exitPointerLock = () => document.exitPointerLock;
}

var keyIsDown = keyCode => inputLogger?.[keyCode] || false;

var push = () => ctx.save();
var pop = () => ctx.restore();
var translate = (x, y) => ctx.translate(x, y);
var noStroke = () => ctx.noStroke = true;
var stroke = (...color) => {
    if (Array.isArray(color[0]))
        color = [...color[0]];
    ctx.noStroke = false;
    if (color != undefined) {
        if (typeof color[0] != 'string') {
            if (color.length == 1 || color.length == 2) {
                result = Array(3).fill(color[0]);
                if (color.length == 2) result[3] = color[1];
                color = result;
            }
            color[3] ??= 255;
            color[3] = (color[3] / 255).toFixed(3);
            color = 'rgba(' + color.join(',') + ')';
        } else color = color[0];
        ctx.strokeStyle = color;
    }
};
var strokeWeight = x => { ctx.lineWidth = x };
var scale = (x, y = x) => ctx.scale(x, y);
var fill = (...color) => {
    if (Array.isArray(color[0]))
        color = [...color[0]];
    if (typeof color[0] != 'string') {
        if (color.length == 1 || color.length == 2) {
            result = Array(3).fill(color[0]);
            if (color.length == 2) result[3] = color[1];
            color = result;
        }
        color[3] ??= 255;
        color[3] = (color[3] / 255).toFixed(3);
        color = 'rgba(' + color.join(',') + ')';
    } else color = color[0];
    ctx.fillStyle = color;
};

var rect = (x, y, w, h) => {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    if (!ctx.noStroke) ctx.stroke();
}
var square = (x, y, s) => rect(x, y, s, s);
var ellipse = (x, y, w, h) => {
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, 2 * PI);
    ctx.fill();
    if (!ctx.noStroke) ctx.stroke();
}
var circle = (x, y, r) => ellipse(x, y, r / 2, r / 2);
var line = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.fill();
    if (!ctx.noStroke) ctx.stroke();
}
var text = (text, x, y) => {
    ctx.fillText(text, x, y);
    if (!ctx.noStroke) ctx.strokeText(text, x, y);
}

const PI = Math.PI
var { abs, tan, cos,
    sin, atan2, sqrt,
    floor, round, ceil,
    random, hypot,
    min, max } = Math;
var radians = angle => angle * PI / 180;
var degrees = angle => angle * 180 / PI;