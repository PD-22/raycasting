function calcLineHeight(its) {
    let p = its.dst * cos(radians(pl0.ang - its.ang));
    return 90 / fov * displayHeight / p;
}

function getTxtrOff({ side, dir, x, y, tOff, val }) {
    let result;
    if (side == 'x') {
        result = y;
        if (dir.x <= 0 && floor(val) != doorVal)
            result = (displayHeight - y);
    } else if (side == 'y') {
        result = x;
        if (dir.y >= 0 && floor(val) != doorVal)
            result = (displayWidth - x);
    }
    if (tOff != undefined)
        result = abs(result - tOff);
    return result % 1;
}

function castWallRays(pos, offAng) {
    rayBuf = []
    let startAng = offAng - fov / 2;
    let ratio = fov / displayWidth;
    for (let ang = startAng; ang < startAng + fov; ang += ratio) {
        let its = castWallRay(pos, ang)
        rayBuf.unshift(its)
    }
    return rayBuf
}

function castWallRay(pos, ang) {
    let cell = { x: Math.floor(pos.x), y: Math.floor(pos.y) }
    let off = { x: pos.x - cell.x, y: pos.y - cell.y }
    let dir = angToDir(ang)
    let tg = abs(tan(radians(ang)))
    let ctg = 1 / tg
    let xsi = { x: pos.x - off.x + (1 + dir.x) / 2, }
    xsi.y = pos.y + abs(xsi.x - pos.x) * tg * dir.y
    let ysi = { y: pos.y - off.y + (1 + dir.y) / 2 }
    ysi.x = pos.x + abs(ysi.y - pos.y) * ctg * dir.x
    let dx = ctg * dir.x
    let dy = tg * dir.y

    while (true) {
        while (abs(pos.x - xsi.x) <= abs(pos.x - ysi.x)) {
            cell.x += dir.x
            collide: if (worldMap[cell.y] === undefined
                || worldMap[cell.y][cell.x] != 0) {
                let val = worldMap[cell.y] != undefined
                    && worldMap[cell.y][cell.x] != undefined
                    ? worldMap[cell.y][cell.x] : 0;
                let ray = {
                    x: xsi.x, y: xsi.y,
                    side: 'x', ang, dir, val
                };
                let texture = wallTextures[ray.val];
                if (floor(ray.val) == doorVal) {
                    let thinTxtr = thin(ray)
                    if (thinTxtr == undefined)
                        break collide;
                    texture = thinTxtr;
                };
                ray.dst = Math.hypot(pos.x - ray.x, pos.y - ray.y);
                return {
                    ...ray, texture,
                    txtrOff: getTxtrOff(ray),
                    lineHeight: calcLineHeight(ray)
                };
            }
            xsi.x += dir.x
            xsi.y += dy
        }
        while (abs(pos.y - ysi.y) <= abs(pos.y - xsi.y)) {
            cell.y += dir.y
            collide: if (worldMap[cell.y] === undefined
                || worldMap[cell.y][cell.x] != 0) {
                let val = worldMap[cell.y] != undefined
                    && worldMap[cell.y][cell.x] != undefined
                    ? worldMap[cell.y][cell.x] : 0;
                let ray = {
                    x: ysi.x, y: ysi.y,
                    side: 'y', ang, dir, val
                }
                let texture = wallTextures[ray.val];
                if (floor(ray.val) == doorVal) {
                    let thinTxtr = thin(ray)
                    if (thinTxtr == undefined)
                        break collide;
                    texture = thinTxtr;
                };
                ray.dst = Math.hypot(pos.x - ray.x, pos.y - ray.y);
                return {
                    ...ray, texture,
                    txtrOff: getTxtrOff(ray),
                    lineHeight: calcLineHeight(ray)
                };
            }
            ysi.x += dx
            ysi.y += dir.y
        }
    }

    function thin(ray) {
        let { dir } = ray;
        let { side } = ray;

        if (side == 'y') {
            let midX = ray.x + 0.5 / tan(radians(ang)) * -dir.y;
            let midY = ray.y - 0.5 * -dir.y;
            let midXOff = midX - floor(ray.x);
            front: if (midXOff > 0 && midXOff < 1) {
                if (midXOff < ray.val % 1) break front;
                ray.tOff = ray.val % 1;
                ray.x = midX;
                ray.y = midY;
                return doorFront_64;
            }
            let sideX = floor(ray.x) + 0.5 + 0.5 * dir.x;
            let offX = sideX - ray.x;
            let sideY = ray.y - tan(radians(ray.ang)) * offX;
            let sideYOff = abs(sideY - floor(ray.y));
            if (sideYOff > 1) return;
            ray.x = sideX;
            ray.y = sideY;
            ray.side = 'x';
            return doorSide_64;
        }

        if (side == 'x') {
            let midY = ray.y + 0.5 * tan(radians(ang)) * -dir.x;
            let midX = ray.x + 0.5 * dir.x;
            let midYOff = midY - floor(ray.y);
            front: if (midYOff > 0 && midYOff < 1) {
                if (midYOff < ray.val % 1) break front;
                ray.tOff = ray.val % 1;
                ray.x = midX;
                ray.y = midY;
                return doorFront_64;
            }
            let sideY = floor(ray.y) + 0.5 + 0.5 * dir.y;
            let offY = sideY - ray.y;
            let sideX = ray.x + tan(radians(ray.ang - 90)) * offY;
            let sideXOff = abs(sideX - floor(ray.x));
            if (sideXOff > 1) return;
            ray.y = sideY;
            ray.x = sideX;
            ray.side = 'y';
            return doorSide_64;
        }

        return wallTextures[0];
    }
}

function castSpriteRays(sprites, ang) {
    let rayArr = [];

    sprites.forEach(sprite => {
        let ray = sprite.castRaySprt(pl0, ang);
        if (ray === undefined) return;
        let { texture } = sprite;
        rayArr.push({ ...ray, texture });
    });

    return rayArr;
}

function castRays(pos, offAng) {
    rayBuf = [];

    let startAng = offAng - fov / 2;
    let ratio = fov / displayWidth;

    let sprites = Sprite.all.filter(p => !p.me && p.visible);

    for (let ang = startAng; ang < startAng + fov; ang += ratio) {
        let wallRay = castWallRay(pos, ang);
        let spriteRays = castSpriteRays(sprites, ang);

        let colRays = [wallRay, ...spriteRays];
        colRays.sort((a, b) => b.dst - a.dst);

        rayBuf.unshift(colRays);
    }

    return rayBuf;
}