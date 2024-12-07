
export class MyriadSongItem extends Item {

    async _preCreate(initData, options, user) {
        await super._preCreate(initData, options, user);
        const icon = this.getDefaultIcon(initData.type);
        this.updateSource({ img: icon });
    }

    prepareData() {
        super.prepareData();    
    }

    hasEffect (effect) {
        return this.system.effects.find(e => e == effect) ? true : false;
    }

    getDefaultIcon(itemType) {
        let icon = CONST.DEFAULT_TOKEN;

        if (itemType == "gift") {
            icon = "systems/myriadsong/assets/gift.png";
        }

        return icon;
    }
}