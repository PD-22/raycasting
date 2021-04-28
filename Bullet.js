import Sprite from "./Sprite.js";
import { getCell, getCellVal, makeMatrix, copyMatrix }
    from "./Matrix.js";

export default class Bullet extends Sprite {
    constructor(x, y, ang = pl0.ang, spd = 0, plr = pl0, txtr = Bullet.texture) {
        if (x == undefined || y == undefined) {
            x = pl0.pos.x;
            y = pl0.pos.y;
        }
        super(x, y, txtr);
        this.speed = spd;
        this.ang = ang;
        this.parent = plr;
        this.texture = txtr;
        this.rad = Bullet.rad;
        Bullet.all.push(this);
    }

    delete() {
        super.delete();
        super.delete.call(this, this.constructor);
    }

    static updateAll() {
        Bullet.all.forEach(b => {
            b.move();
            if (b.checkWall())
                b.delete();
            b.checkPlrs()
                .filter(p => p.id != b.parent.id)
                .forEach(p => p.alive = false);
        });
    }

    move() {
        let vx = this.speed * Math.cos(radians(this.ang));
        let vy = this.speed * -Math.sin(radians(this.ang));
        this.pos.x += vx;
        this.pos.y += vy;

    }

    static all = []

    checkWall() {
        let { x, y } = this.pos;
        let cell = getCell(x, y, false);
        let val = getCellVal(cell);
        let inWall = val != 0;
        return inWall ? cell : null;
    }

    checkPlrs() {
        return Player.all.filter(plr => {
            let dx = this.pos.x - plr.pos.x;
            let dy = this.pos.y - plr.pos.y;
            let dst = Math.hypot(dy, dx);
            return dst < Player.rad + this.rad;
        });
    }

    static texture = makeMatrix(16, 16).map((r, i) =>
        r.map((c, j) => (i == 8 || i == 7) &&
            (j == 8 || j == 7) ? [255, 255, 0] : -1))

    static rad = 1 / 16;
}