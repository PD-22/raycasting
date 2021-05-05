let rayBuff = [];
export { rayBuff };

import { fov } from "./sketch.js";
import { angToDir } from "./angles.js";
import { res } from "./render.js";

export function castRay(pos, ang) {
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
            if (map[cell.y] == undefined
                || map[cell.y][cell.x] != 0) {
                return {
                    dst: Math.hypot(pos.x - xsi.x, pos.y - xsi.y),
                    x: xsi.x, y: xsi.y,
                    side: 'x', ang, dir,
                    val: map[cell.y] != undefined
                        && map[cell.y][cell.x] != undefined
                        ? map[cell.y][cell.x] : 0
                }
            }
            xsi.x += dir.x
            xsi.y += dy
        }
        while (abs(pos.y - ysi.y) <= abs(pos.y - xsi.y)) {
            cell.y += dir.y
            if (map[cell.y] == undefined
                || map[cell.y][cell.x] != 0) {
                return {
                    dst: Math.hypot(pos.x - ysi.x, pos.y - ysi.y),
                    x: ysi.x, y: ysi.y,
                    side: 'y', ang, dir,
                    val: map[cell.y] != undefined
                        && map[cell.y][cell.x] != undefined
                        ? map[cell.y][cell.x] : 0
                }
            }
            ysi.x += dx
            ysi.y += dir.y
        }
    }
}

export function castRays(pos, offAng, r = width) {
    res.setRes(r);
    rayBuff = []
    let inc = fov / res.value
    for (let ang = offAng - fov / 2; ang < offAng + fov / 2; ang += inc) {
        let its = castRay(pos, ang)
        rayBuff.unshift(its)
    }
    return rayBuff
}

export function getTxtrOff(its, side, dir) {
    if (side == 'x') {
        if (dir.x > 0) {
            return its.y % 1
        } else {
            return (mRows - its.y) % 1
        }
    } else if (side == 'y') {
        if (dir.y < 0) {
            return its.x % 1
        } else {
            return (mCols - its.x) % 1
        }
    }
}