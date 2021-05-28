var canvas;
var ctx;
var deltaTime;
var keyCode;

function draw() { };
function setup() { };
function keyPressed() { };

var downKeys = {};

const SHIFT = 16;
const CONTROL = 17;
const ALT = 18;
const SPACE = 32;
const UP_ARROW = 38;
const LEFT_ARROW = 37;
const DOWN_ARROW = 40;
const RIGHT_ARROW = 39;

window.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('keydown', e => {
        keyCode = e.keyCode;
        keyPressed(keyCode);
        downKeys[keyCode] = true;
    });
    document.body.addEventListener('keyup', e => {
        keyCode = e.keyCode;
        downKeys[keyCode] = false;
    });
    setup();
});

(function animate(time, lastTime) {
    if (lastTime != undefined) {
        deltaTime = time - lastTime;
        draw();
    }
    requestAnimationFrame(newTime => animate(newTime, time));
})()

function createCanvas(width, height) {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    document.body.append(canvas);

    ctx = canvas.getContext('2d');
    ctx.noStroke = true;
}

var keyIsDown = keyCode => downKeys?.[keyCode] || false;

var push = () => ctx.save();
var pop = () => ctx.restore();
var noStroke = () => ctx.noStroke = true;
var scale = (x, y = x) => ctx.scale(x, y);
var fill = color => ctx.fillStyle = color;

var square = (x, y, s) => {
    ctx.beginPath();
    ctx.rect(x, y, s, s);
    ctx.fill();
}

const PI = Math.PI
var abs = Math.abs;
var tan = Math.tan;
var cos = Math.cos;
var sin = Math.sin;
var atan2 = Math.atan2;
var sqrt = Math.sqrt;
var radians = angle => angle * PI / 180;
var degrees = angle => angle * 180 / PI;