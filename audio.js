function playAudio(srcAudio, srcPos) {
    let audioElement = srcAudio.cloneNode();
    let track = audioContext.createMediaElementSource(audioElement);

    var gainNode = audioContext.createGain();
    var panerNode = audioContext.createStereoPanner();

    track
        .connect(gainNode)
        .connect(panerNode)
        .connect(audioContext.destination);

    gainNode.gain.value *= getVolume(srcPos)
        * volume / 10;
    panerNode.pan.value = getPan(srcPos);

    audioContext.resume();
    audioElement.play();
}

function getPan(srcPos) {
    let dy = pl0.pos.y - srcPos.y;
    let dx = pl0.pos.x - srcPos.x;

    if (dx == 0 && dy == 0) return 0;

    let ang = atan2(dy, dx);

    ang = normalAng(pl0.ang + degrees(ang));

    if (ang > 90) ang = 180 - ang;
    if (ang < -90) ang = -180 - ang;

    let pan = -ang / 90;

    if (pan < -1 || pan > 1)
        throw new Error('bad pan value');

    return pan;
}


function getVolume(srcPos) {
    let { x: x1, y: y1 } = srcPos;
    let { x: x0, y: y0 } = pl0.pos;

    let dst = hypot(x0 - x1, y0 - y1);
    dst = max(1, dst);

    let volume = 1 / dst;
    return volume;
}