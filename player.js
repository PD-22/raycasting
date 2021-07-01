class Player extends Sprite {
    constructor(x, y, ang, ammoNum = 0) {
        ang ??= Math.floor(Math.random() * 360);
        if (x == undefined || y == undefined) {
            let spawned = Player.randPos()
            x = spawned.x
            y = spawned.y
        }
        super(x, y, Player.textures[0])
        this.ammoNum = ammoNum;
        this.textures = Player.textures
        this.ang = ang
        this.speed = 1;
        this.txtrIndex = 0;
        this.txtrIndexOff = 0;
        this.moveAnimIndex = 0;
        this.tool = 1;
        this.toolAnimIndex = 0;
        this.txtrSide = 0;
        this.dir = { x: 0, y: 0 };
        this.vel = { x: 0, y: 0 };
        this.alive = true
        this.rad = Player.rad
        Player.all.push(this)
    }

    static get me() {
        return Player.all.find(p => p == pl0);
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
        if (this.tool == 1 && this.animatingTool && this.txtrSide == 0) { // shoot anim
            let animArr = [43, 44, 43];
            let animIndex = Math.floor(this.toolAnimIndex);
            let i = floor(animArr.length * animIndex / 5);
            this.txtrIndex = animArr[i];
        };
        let txtr = this.textures[this.txtrIndex];
        this.texture = txtr
        return txtr
    }

    static all = []

    useTool() {
        if (this.animatingTool) return;
        if (this.tool == 1) { // gun
            if (this.ammoNum < 1) return;
            this.ammoNum--;
        }
        this.animatingTool = true;
    }

    fire() {
        if (!this.alive || this.usingTool) return;

        let audio = [knife_aud, pistol_aud][this.tool];
        playAudio(audio, this.pos);

        this.usingTool = true;

        let wallDst = castWallRay(this.pos, this.ang).dst
        let maxDst = wallDst;
        if (this.tool == 0) maxDst = min(wallDst, 1); // short knife

        let got = Player.all.filter(p => p != this && p.alive)
            .map(p => ({ p, its: p.castRaySprt(this, this.ang, 1 / 6) }))
            .filter(e => e.its != undefined && e.its.dst < maxDst)
            .sort((a, b) => a.its.dst - b.its.dst)
            .map(e => e.p);
        got.forEach(p => p.die());
    }

    die() { this.alive = this.blocking = false; }

    rotate(deltaAng = 0) {
        if (!this.alive) return
        let smoothAng = deltaAng * deltaTime / 200;
        this.ang -= smoothAng % 360;
        this.ang = normalAng(this.ang);
    }

    static spawnMany(n, ...args) {
        for (let i = 0; i < n; i++)
            new Player(...args);
    }

    static rad = 1 / 4;

    updateAnimation() {
        this.updateTexture();
        if (this.animatingTool) {
            this.toolAnimIndex += deltaTime / 32;
            let animIndex = Math.floor(this.toolAnimIndex);
            if (animIndex >= 2 && !this.usingTool) this.fire();
            if (this.toolAnimIndex >= 5) {
                this.toolAnimIndex = 0;
                this.animatingTool = false;
                this.usingTool = false;
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
                playAudio(thud_aud, this.pos);
                this.fallen = true;
            }
        }
    }

    updateVelocity(keys) {
        let vel = { x: 0, y: 0 }
        this.vel = vel;

        if (!this.alive || !keys) return
        let [forward, left, back, right] = keys;
        let dir = { x: 0, y: 0 }

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

    updateRotate([left, right]) {
        let dir = 0;
        if (keyIsDown(left)) dir--;
        if (keyIsDown(right)) dir++;
        if (keyIsDown(SHIFT)) dir *= 2;
        this.rotate(dir * 10);
    }

    respondToCollision() {
        if (!this.alive) return;
        this.getAdjCells().forEach(cell => this.wallCollide(cell));
        this.spriteCollision();

        if (this == pl0) {
            let door = isInDoor(pl0);
            if (door != undefined) {
                if (entDoorSide == undefined) {
                    let { pos } = pl0;
                    let cenDst = {
                        x: pos.x - (door.x + 0.5),
                        y: pos.y - (door.y + 0.5)
                    }
                    entDoorSide = abs(cenDst.x) > abs(cenDst.y) ? 'x' : 'y';
                }
            } else entDoorSide = undefined;
        }
    }
}