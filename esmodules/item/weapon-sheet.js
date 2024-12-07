
export class MyriadSongWeaponSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 680,
            height: 886,
            classes: ["myriadsong", "sheet", "item"]
        });
    }

    get template() {
        return `systems/myriadsong/templates/item/weapon-sheet.hbs`;
    }

    getData() {
        const baseData = super.getData();

        const descriptors = this._getDescriptors(CONFIG.MYRIADSONG.wpnDescriptors);
        const effects = this._getDamageEffectList(CONFIG.MYRIADSONG.damageEffects);

        const sheetData = {
            ...baseData.item,
            "config": CONFIG.MYRIADSONG,
            "effects": effects,
            "descriptors": descriptors,
            owner: this.item.isOwner,
            editable: this.isEditable
        }

        return sheetData;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".checkdescriptor").change(event => this.setDescriptor(event));
        html.find(".checkeffect").change(event => this.setEffect(event));
    }

    async setDescriptor(event) {
        const descriptor = event.currentTarget.name;
        let descriptors = this.item.system.descriptors;

        if (descriptors.includes(descriptor)) {
            const index = descriptors.indexOf(descriptor);
            descriptors.splice(index, 1);
        } else {
            if (descriptors == "") {
                const arr = [descriptor];
                descriptors = arr;
            } else {
                descriptors.push(descriptor);
            }
        }

        await this.item.update({["system.descriptors"]: descriptors});
    }

    async setEffect(event) {
        const effect = event.currentTarget.name;
        let effects = this.item.system.effects;

        if (effects.includes(effect)) {
            console.log("Item found in array");
            const index = effects.indexOf(effect);
            effects.splice(index, 1);
        } else {
            if (effects == "") {
                console.log("Effects is empty string");
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

    _getDescriptors(itemDescriptors) {
        let descriptors = [];
        for (const [key, value] of Object.entries(itemDescriptors)) {

            let checked = "";
            if (this.item.system.descriptors.includes(key)) {
                checked = "checked";
            }
            const descriptor = {
                "name": key,
                "label": game.i18n.localize(value),
                "checked": checked
            };

            descriptors.push(descriptor);
        }

        return descriptors;
    }
}