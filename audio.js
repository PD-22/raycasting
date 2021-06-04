function playAudio(srcAudio, srcPos) {
    let { x: x1, y: y1 } = srcPos;
    let { x: x0, y: y0 } = pl0.pos;

    let dst = hypot(x0 - x1, y0 - y1);
    dst = max(1, dst);

    let audio = srcAudio.cloneNode();
    audio.volume = srcAudio.volume / dst;
    audio.play();
}