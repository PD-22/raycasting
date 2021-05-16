class Sprite {
    constructor(x, y, texture) {
        this.pos = { x, y };
        this.visible = true;
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

    static castAll(wallDst, i) {
        Sprite.all.filter(s => s.visible)
            .map(s => ({ s, its: s.castRaySprt(pl0, rayBuf[i].ang) }))
            .filter(e => e.its != undefined && e.its.dst < wallDst && e.s.me != true)
            .sort((a, b) => b.its.dst - a.its.dst)
            .forEach(e => {
                let hPlr = calcLineHeight(e.its)
                drawTextureCol(e.its, i, hPlr, e.s.texture)
            });
    }

    castRaySprt(pl0, rayAng = Player.all[0].ang, maxOff = 0.5) {
        let dx = this.pos.x - pl0.pos.x
        let dy = this.pos.y - pl0.pos.y
        let strghtDst = Math.hypot(dx, dy)

        rayAng = rayAng == undefined ? pl0.ang : normalAng(rayAng)

        let strghtAng = degrees(atan2(-dy, dx))
        strghtAng = normalAng(strghtAng)

        let plrsAng = 180 - this.ang + strghtAng
        plrsAng = normalAng(plrsAng)

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

        return {
            x, y, ang: rayAng, type: 'sprite',
            txtrOff: (0.5 - sOff),
            dst: rayDst, plrsAng,
            dir: angToDir(rayAng)
        }
    }
}