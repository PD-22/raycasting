class Player extends Sprite {
    constructor(x, y, ang = Math.floor(Math.random() * 360),
        rad = Player.rad, speed = 1) {
        if (x === undefined || y === undefined) {
            let spawned = Player.randPos()
            x = spawned.x
            y = spawned.y
        }
        super(x, y, Player.textures[0])
        this.textures = Player.textures
        this.ang = ang
        this.speed = speed;
        this.txtrIndex = 0;
        this.txtrIndexOff = 0;
        this.moveAnimIndex = 0;
        this.gunAnimIndex = 0;
        this.txtrSide = 0;
        this.shooting = false;
        this.dir = { x: 0, y: 0 };
        this.vel = { x: 0, y: 0 };
        this.alive = true
        this.rad = rad
        this.me = Player.all.length == 0
        Player.all.push(this)
    }

    static get me() {
        return Player.all.find(p => p.me);
    }

    delete() {
        super.delete();
        super.delete.call(this, this.constructor);
    }

    castRaySprt(pl0 = Player.me, rayAng = Player.me.ang, maxOff = 0.5) {
        let its = super.castRaySprt(pl0, rayAng, maxOff)
        if (its != undefined) this.updateTexSide(its)
        return its
    }

    updateTexSide({ txtrAng }) {
        let offAng = 180 / 8;
        let ang = (txtrAng + 360 + offAng) % 360;
        this.txtrSide = this.alive ?
            Math.floor(ang / 2 / offAng) : 45;
    }

    updateTexture() {
        let length = this.textures.length - 1;
        let txtrIndex = Math.floor(this.txtrSide + this.txtrIndexOff);
        if (txtrIndex > length) txtrIndex = length;
        this.txtrIndex = txtrIndex;
        if (this.shooting && this.txtrSide == 0) {
            let animArr = [43, 44, 43];
            let animIndex = Math.floor(this.gunAnimIndex);
            let i = floor(animArr.length * animIndex / 5);
            this.txtrIndex = animArr[i];
        };
        let txtr = this.textures[this.txtrIndex];
        this.texture = txtr
        return txtr
    }

    static all = []

    shoot() { this.shooting = true }

    fire() {
        if (!this.alive || this.firing) return;

        playAudio(pistol_wav, this.pos);

        this.firing = true;
        let wallDst = castWallRay(this.pos, this.ang).dst;
        let shot = Player.all.filter(p => p != this && p.alive)
            .map(p => ({ p, its: p.castRaySprt(this, this.ang, 1 / 6) }))
            .filter(e => e.its != undefined && e.its.dst < wallDst)
            .sort((a, b) => a.its.dst - b.its.dst)
            .map(e => e.p);
        shot.forEach(p => p.die());
    }

    die() { this.alive = this.blocking = false; }

    rotate(deltaAng = 0) {
        if (!this.alive) return
        let smoothAng = deltaAng * deltaTime / 110;
        this.ang -= smoothAng % 360;
        this.ang = normalAng(this.ang);
    }

    static spawnMany(n) {
        for (let i = 0; i < n; i++) new Player()
    }

    static rad = 1 / 4;

    updateAnimation() {
        this.updateTexture();
        if (this.shooting) {
            this.gunAnimIndex += deltaTime / 32;
            let animIndex = Math.floor(this.gunAnimIndex);
            if (animIndex >= 2 && !this.firing) this.fire();
            if (this.gunAnimIndex >= 5) {
                this.gunAnimIndex = 0;
                this.shooting = false;
                this.firing = false;
            }
        }
        if (this.alive) {
            if (this.dir.x || this.dir.y) {
                let animationOff = Math.floor(this.moveAnimIndex) * 8;
                this.txtrIndexOff = 8 + animationOff;
                this.moveAnimIndex =
                    (this.moveAnimIndex - deltaTime / 160) % 4;
                if (this.moveAnimIndex < 0)
                    this.moveAnimIndex += 4;
            } else {
                this.txtrIndexOff = 0;
                this.moveAnimIndex = 0;
            };
        } else {
            if (this.txtrIndex < this.textures.length - 1) {
                this.moveAnimIndex = (this.moveAnimIndex - deltaTime / 160);
                this.txtrIndexOff = -Math.floor(this.moveAnimIndex)
            } else if (!this.fallen) {
                playAudio(thud_wav, this.pos);
                this.fallen = true;
            }
        }
    }

    updateVelocity(keys) {
        if (!this.alive || !keys) return
        let [forward, left, back, right] = keys;
        let dir = { x: 0, y: 0 }
        let vel = { x: 0, y: 0 }

        if (keyIsDown(forward)) dir.y = -1
        if (keyIsDown(left)) dir.x = -1
        if (keyIsDown(back)) dir.y = 1
        if (keyIsDown(right)) dir.x = 1

        this.dir = { x: dir.x, y: - dir.y };

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

        vel.x *= this.speed / 30
        vel.x *= deltaTime / 14
        vel.y *= this.speed / 30
        vel.y *= deltaTime / 14


        if (this.me && keyIsDown(SHIFT)) {
            vel.x *= 1.75
            vel.y *= 1.75
        }

        this.vel = vel;
    }

    updatePosition() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
    }

    static animateAll() {
        Player.all.forEach(p => p.updateAnimation());
    }

    update(keys = undefined) {
        let moveKeys = keys.slice(0, 4);
        let rotateKeys = keys.slice(4);
        this.updateVelocity(moveKeys);
        this.updatePosition();
        this.updateRotate(rotateKeys);
        this.respondToCollision();
    }

    updateRotate([left, right]) {
        let dir = 0;
        if (keyIsDown(left)) dir--;
        if (keyIsDown(right)) dir++;
        this.rotate(dir * 10);
    }

    respondToCollision() {
        this.getAdjCells().forEach(
            cell => this.wallCollide(cell));
        this.spriteCollision()
    }

    wallCollide(cell) {
        let cellVal = getCellVal(cell);
        let collision = this.wallCollision(cell);
        if (cellVal == 0 || collision == null) return;
        if (collision.type == 'side') {
            let axis = collision.value;
            let center = cell[axis] + 0.5
            let sign = Math.sign(this.pos[axis] - center);
            this.pos[axis] = center + sign * (0.5 + this.rad);
        } else if (collision.type == 'corner') {
            let delta = {
                x: this.pos.x - collision.value.x,
                y: this.pos.y - collision.value.y
            }
            let axis = Math.abs(delta.x) < Math.abs(delta.y) ? 'y' : 'x';
            let axis2 = axis == 'y' ? 'x' : 'y';
            this.pos[axis] =
                collision.value[axis] + Math.sign(delta[axis]) *
                Math.sqrt(this.rad ** 2 - delta[axis2] ** 2);
        }
    }

    wallCollision(cell) {
        let cellCenter = { x: cell.x + 0.5, y: cell.y + 0.5 };
        let crclDst = {
            x: Math.abs(this.pos.x - cellCenter.x),
            y: Math.abs(this.pos.y - cellCenter.y),
        };

        if (crclDst.x >= (0.5 + this.rad)) return null;
        if (crclDst.y >= (0.5 + this.rad)) return null;

        if (crclDst.x <= 0.5) return { type: 'side', value: 'y' };
        if (crclDst.y <= 0.5) return { type: 'side', value: 'x' };

        for (let i = 0; i <= 1; i++) {
            for (let j = 0; j <= 1; j++) {
                let corner = { x: cell.x + j, y: cell.y + i };
                let dst = Math.hypot(
                    Math.abs(this.pos.x - corner.x),
                    Math.abs(this.pos.y - corner.y),
                );
                if (dst <= this.rad) return { type: 'corner', value: corner };
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
        let spaces = copyMatrix(worldMap)
        for (let i = 0; i < spaces.length; i++) {
            for (let j = 0; j < spaces[0].length; j++) {
                let ri = Math.floor(Math.random() * spaces.length)
                let rj = Math.floor(Math.random() * spaces[0].length)
                spaces[i][j] = { i: ri, j: rj }
                spaces[ri][rj] = { i: i, j: j }
            }
        }

        for (let i = 0; i < spaces.length; i++) {
            for (let j = 0; j < spaces[0].length; j++) {
                const c = spaces[i][j]

                let taken = false;
                Player.all.forEach(p => {
                    let { pos } = p;
                    if (Math.floor(pos.y) == c.i &&
                        Math.floor(pos.x) == c.j) {
                        taken = true;
                        return;
                    }
                });

                if (worldMap[c.i][c.j] == 0 && !taken) {
                    return { y: 0.5 + c.i, x: 0.5 + c.j }
                }
            }
        }

        console.error('bad spawn');
        return {
            y: floor(random() * worldMap.length) + 0.5,
            x: floor(random() * worldMap[0].length) + 0.5,
        }
    }
}