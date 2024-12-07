
export class MyriadSongNpcAttackSheet extends ItemSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 680,
            height: 770,
            classes: ["myriadsong", "sheet", "item"]
        });
    }

    get template() {
        return `systems/myriadsong/templates/item/npcattack-sheet.hbs`;
    }

    getData() {
        const baseData = super.getData();

        const effects = this._getDamageEffectList(CONFIG.MYRIADSONG.damageEffects);

        const sheetData = {
            ...baseData.item,
            "config": CONFIG.MYRIADSONG,
            "effects": effects,
            owner: this.item.isOwner,
            editable: this.isEditable
        }

        return sheetData;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".checkeffect").change(event => this.setEffect(event));
    }

    async setEffect(event) {
        const effect = event.currentTarget.name;
        let effects = this.item.system.effects;

        if (effects.includes(effect)) {
            const index = effects.indexOf(effect);
            effects.splice(index, 1);
        } else {
            if (effects == "") {
                const arr = [effect];
                effects = arr;
            } else {
                effects.push(effect);
            }
        }

        await this.item.update({["system.effects"]: effects});
    }

    _getDamageEffectList(effects) {
        let damageEffects = [];

        for (const [key, value] of Object.entries(effects)) {

            let checked = "";
            if (this.item.system.effects.includes(key)) {
                checked = "checked";
            }
            const damageEffect = {
                "name": key,
                "label": game.i18n.localize(value),
                "checked": checked
            };

            damageEffects.push(damageEffect);
        }

        return damageEffects;
    }
}