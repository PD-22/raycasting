class Item extends Sprite {
    constructor(x, y, type) {
        let texture;
        if (type == 'ammo') texture = ammo_64;
        if (type == 'med') texture = med_64;
        super(x, y, texture, false);
        this.type = type;
        this.rad = Item.rad;
        Item.all.push(this);
    }

    static all = [];

    static rad = 1 / 4;

    static spawnMany(n, type) {
        for (let i = 0; i < n; i++) {
            let { x, y } = Item.randPos();
            new Item(x, y, type);
        }
    }

    delete() {
        super.delete();
        super.delete.call(this, this.constructor);
    }

    pick(picker) {
        if (this.type == 'ammo') {
            let maxAmmo = 8;
            if (picker.ammoNum >= maxAmmo) return;
            let newAmmoNum = picker.ammoNum + 4;
            picker.ammoNum = min(newAmmoNum, maxAmmo);
            playAudio(ammo_aud, pl0.pos);
            if (touch_mouse == 'touch' && pl0.ammoNum > 0)
                pl0.tool = 1;
        }
        this.delete();
    }
}