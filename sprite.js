class Sprite {
    constructor(x, y, texture, blocking = true) {
        this.pos = { x, y };
        this.visible = true;
        this.blocking = blocking;
        this.texture = texture;
        this.id = Sprite.idCount;
        Sprite.all.push(this);
        Sprite.idCount = Sprite.all.length;
    }

    delete(thisClass = Sprite) {
        thisClass.all = thisClass.all
            .filter(s => s.id != this.id);
        Sprite.idCount = Sprite.all.length;
    }

    static idCount = 0;

    static all = []

    static castAll(wallDst, i) { // temp?
        Sprite.all.filter(s => s.visible)
            .map(s => ({ s, its: s.castRaySprt(pl0, rayBuf[i].ang) }))
            .filter(e => e.its != undefined && e.its.dst < wallDst && e.s.me != true)
            .sort((a, b) => b.its.dst - a.its.dst)
            .forEach(e => {
                let hPlr = calcLineHeight(e.its)
                drawTextureCol(e.its, i, hPlr, e.s.texture)
            });
    }

    spriteCollision() {
        let { pos } = this;
        let { x, y } = pos;
        x -= 0.5; y -= 0.5;
        let min = { x: floor(x), y: floor(y) };
        let max = { x: ceil(x) + 1, y: ceil(y) + 1 };

        let pos0 = pos;
        Sprite.all.filter(s => s != this && s.blocking).forEach(sprite => {
            let { pos } = sprite;
            let { x, y } = pos;
            if (x >= min.x && y >= min.y &&
                x < max.x && y < max.y) {
                let dx = pos0.x - x;
                let dy = pos0.y - y;
                let dst = Math.hypot(dx, dy);
                let rad = sprite.rad * 2;
                if (dst < rad) {
                    sprite.traki = true;
                    let ang = atan2(dy, dx);
                    let dif = rad - dst;
                    this.pos.x += cos(ang) * dif;
                    this.pos.y += sin(ang) * dif;
                };
            }
        })
    }

    castRaySprt(pl0 = Player.me, rayAng = Player.me.ang, maxOff = 0.5) {
        let dx = this.pos.x - pl0.pos.x
        let dy = this.pos.y - pl0.pos.y
        let strghtDst = Math.hypot(dx, dy)

        rayAng = rayAng === undefined ? pl0.ang : normalAng(rayAng)

        let strghtAng = degrees(atan2(-dy, dx))
        strghtAng = normalAng(strghtAng)

        let txtrAng = 180 - this.ang + strghtAng
        txtrAng = normalAng(txtrAng)

        let rayStrghtAng = rayAng - strghtAng
        rayStrghtAng = normalAng(rayStrghtAng)

        let minAng = pl0.ang - fov / 2
        minAng = normalAng(minAng)

        let maxAng = pl0.ang + fov / 2
        maxAng = normalAng(maxAng)

        if (Math.abs(rayStrghtAng) > fov / 2) return

        let sOff = Math.tan(radians(rayStrghtAng)) * strghtDst

        if (Math.abs(sOff) >= maxOff) return

        let rayDst = sOff / Math.sin(radians(rayStrghtAng))

        let x = pl0.pos.x + rayDst * Math.cos(radians(rayAng))
        let y = pl0.pos.y - rayDst * Math.sin(radians(rayAng))

        let ray = {
            x, y, ang: rayAng,
            txtrOff: (0.5 - sOff),
            dst: rayDst, txtrAng,
            dir: angToDir(rayAng)
        }

        return { ...ray, lineHeight: calcLineHeight(ray) };
    }
}