function reachDoor(plr) {
    let { pos, ang } = plr
    let ray = castWallRay(pos, ang, false);
    let { dst, val } = ray;
    if (dst > 1 || val != doorVal) return false;
    let { x, y } = ray.cell;
    toggleDoor(x, y);
    return true;
}

function animDoors() {
    for (let i = 0; i < animDoorList.length; i++) {
        let door = animDoorList[i];
        let { x, y, dir } = door;

        let speed = deltaTime * 0.06 / 60
        let newVal = worldMap[y][x] + speed * dir;

        if (newVal > doorVal + 1) {
            newVal = doorVal + 0.99;
            animDoorList.shift();
            i--;
        } else if (newVal < doorVal) {
            newVal = doorVal;
            animDoorList.shift();
            i--;
        }

        worldMap[y][x] = newVal;
    }
}

function toggleDoor(x, y) {
    let cell = worldMap[y][x];
    if (floor(cell) != doorVal || animDoorList
        .some(d => d.x == x && d.y == y) ||
        Sprite.all.some(sprite => touchesDoor(sprite, { x, y }))) return;
    playAudio(door_aud, { x, y })
    let dir;
    dir = cell % 1 > 0.5 ? -1 : 1;
    let door = { x, y, dir };
    animDoorList.push(door);
    emitToggleDoor(x, y);
}

function touchesDoor(sprite, door) {
    return sprite.getAdjCells().some(cell =>
        cell.x == door.x && cell.y == door.y &&
        sprite.wallCollision(cell) != null
    );
}

function isInDoor(sprite) {
    let { pos } = sprite;
    let posX = floor(pos.x);
    let posY = floor(pos.y);

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            let cellVal = floor(worldMap[y][x]);
            if (cellVal == doorVal &&
                posX == x && posY == y)
                return { x, y };
        }
    }

    return null;
}