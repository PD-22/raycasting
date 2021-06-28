class Item extends Sprite {
    constructor(x, y, texture, type) {
        super(x, y, texture, false);
        this.type = type;
        this.rad = Item.rad;
        Item.all.push(this);
    }

    static all = [];

    static rad = 1 / 4;

    static spawnMany(n, texture, type) {
        for (let i = 0; i < n; i++) {
            let { x, y } = Item.randPos();
            new Item(x, y, texture, type);
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
        }
        this.delete();
    }
}