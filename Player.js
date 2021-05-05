import Sprite from "./Sprite.js";
import { getCell, getCellVal, makeMatrix, copyMatrix }
    from "./Matrix.js"
import { map } from "./sketch.js";

export default class Player extends Sprite {
    constructor(x, y, ang = Math.floor(Math.random() * 360), speed = 1) {
        if (x == undefined || y == undefined) {
            let spawned = Player.randPos()
            x = spawned.x
            y = spawned.y
        }
        super(x, y, Player.textures[0])
        this.ang = ang
        this.speed = speed
        this.alive = true
        this.me = Player.all.length == 0
        if (this.me) this.aim = false;
        Player.all.push(this)
    }

    delete() {
        super.delete();
        super.delete.call(this, this.constructor);
    }

    castRaySprt(pl0, rayAng = Player.all[0].ang, maxOff = 0.5) {
        let its = super.castRaySprt(pl0, rayAng, maxOff)
        if (its != undefined)
            this.updateTexture(its.plrsAng)
        return its
    }

    updateTexture(plrsAng) {
        let txtrSide
        if (!this.alive) {
            txtrSide = 4
        } else if (Math.abs(plrsAng) > 135) {
            txtrSide = 3
        } else if (Math.abs(plrsAng) > 45) {
            txtrSide = plrsAng > 0 ? 1 : 2
        } else {
            txtrSide = 0
        }
        let txtr = Player.textures[txtrSide]
        this.texture = txtr
        return txtr
    }

    static all = []

    shoot() {
        if (!this.alive) return;
        let { x, y } = this.pos;
        let ang = this.ang;
        let rad = Player.rad;
        x += rad * Math.cos(radians(ang));
        y += rad * -Math.sin(radians(ang));
        new Bullet(x, y, ang, 0.25);
    }

    rotate() {
        if (!this.alive) return
        let angD = -normalAng(movedX * deltaTime / 110)
        if (this.aim) angD /= 2;
        this.ang += angD;
    }

    static spawnMany(n) {
        for (let i = 0; i < n; i++) new Player()
    }

    static rad = 1 / 4;

    move(forward, left, back, right) {
        if (!this.alive) return
        let dir = { x: 0, y: 0 }
        let vel = { x: 0, y: 0 }

        if (keyIsDown(forward)) dir.y = -1
        if (keyIsDown(left)) dir.x = -1
        if (keyIsDown(back)) dir.y = 1
        if (keyIsDown(right)) dir.x = 1

        if (dir.y == -1) {
            vel.y += -sin(radians(this.ang))
            vel.x += cos(radians(this.ang))
        }
        if (dir.y == 1) {
            vel.y += sin(radians(this.ang))
            vel.x += -cos(radians(this.ang))
        }
        if (dir.x == -1) {
            vel.y += -cos(radians(this.ang))
            vel.x += -sin(radians(this.ang))
        }
        if (dir.x == 1) {
            vel.y += cos(radians(this.ang))
            vel.x += sin(radians(this.ang))
        }

        dir.x = vel.x
        if (dir.x != 0) dir.x = (dir.x > 0) * 2 - 1
        dir.y = vel.y
        if (dir.y != 0) dir.y = (dir.y > 0) * 2 - 1

        let mag = sqrt(vel.x ** 2 + vel.y ** 2)
        if (mag != 0) {
            vel.x /= mag
            vel.y /= mag
        }

        vel.x *= this.speed / 20
        vel.x *= deltaTime / 14
        vel.y *= this.speed / 20
        vel.y *= deltaTime / 14


        if (this.me && keyIsDown(SHIFT)) {
            vel.x *= 2
            vel.y *= 2
        }


        this.pos.x += vel.x;
        this.pos.y += vel.y;

        // collision response (make another function?)
        this.getAdjCells().forEach((cell, i) => {
            let cellVal = getCellVal(cell);
            let collision = this.checkCollision(cell);
            if (cellVal != 0 && collision != null) {
                if (collision.type == 'side') {
                    let axis = collision.value;
                    let center = cell[axis] + 0.5
                    let sign = Math.sign(this.pos[axis] - center);
                    this.pos[axis] = center + sign * (0.5 + Player.rad);
                } else if (collision.type == 'corner') {
                    let delta = {
                        x: this.pos.x - collision.value.x,
                        y: this.pos.y - collision.value.y
                    }
                    let axis = Math.abs(delta.x) < Math.abs(delta.y) ? 'y' : 'x';
                    let axis2 = axis == 'y' ? 'x' : 'y';
                    this.pos[axis] =
                        collision.value[axis] + Math.sign(delta[axis]) *
                        Math.sqrt(Player.rad ** 2 - delta[axis2] ** 2);
                }
            }
        })
    }

    checkCollision(cell) {
        let rad = Player.rad;
        let cellCenter = { x: cell.x + 0.5, y: cell.y + 0.5 };
        let crclDst = {
            x: Math.abs(this.pos.x - cellCenter.x),
            y: Math.abs(this.pos.y - cellCenter.y),
        };

        if (crclDst.x >= (0.5 + rad)) return null;
        if (crclDst.y >= (0.5 + rad)) return null;

        if (crclDst.x <= 0.5) return { type: 'side', value: 'y' };
        if (crclDst.y <= 0.5) return { type: 'side', value: 'x' };

        for (let i = 0; i <= 1; i++) {
            for (let j = 0; j <= 1; j++) {
                let corner = { x: cell.x + j, y: cell.y + i };
                let dst = Math.hypot(
                    Math.abs(this.pos.x - corner.x),
                    Math.abs(this.pos.y - corner.y),
                );
                if (dst <= rad) return { type: 'corner', value: corner };
            }
        }

        return null;
    }

    getAdjCells() {
        let cells = [];
        let x = Math.round(this.pos.x);
        let y = Math.round(this.pos.y);
        for (let i = -1; i <= 0; i++) {
            for (let j = -1; j <= 0; j++) {
                cells.push(getCell(x + j, y + i, false))
            }
        }
        return cells;
    }

    static randPos() {
        let spaces = copyMatrix(map)
        for (let i = 0; i < spaces.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                let ri = Math.floor(Math.random() * spaces.length)
                let rj = Math.floor(Math.random() * spaces.length)
                spaces[i][j] = { i: ri, j: rj }
                spaces[ri][rj] = { i: i, j: j }
            }
        }

        for (let i = 0; i < spaces.length; i++) {
            for (let j = 0; j < spaces[0].length; j++) {
                const c = spaces[i][j]
                if (map[c.i][c.j] == 0) {
                    return { y: 0.5 + c.i, x: 0.5 + c.j }
                }
            }
        }
        return { x: 0.5 + map.length / 2 + 0.5, y: 0.5 + map[0].length / 2 }
    }
}