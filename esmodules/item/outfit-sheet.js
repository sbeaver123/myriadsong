
export class MyriadSongOutfitSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 524,
            height: 578,
            classes: ["myriadsong", "sheet", "item"]
        });
    }

    get template() {
        return `systems/myriadsong/templates/item/outfit-sheet.hbs`;
    }

    getData() {
        const baseData = super.getData();
        const descriptors = this._getDescriptors(CONFIG.MYRIADSONG.outfitDescriptors);

        const sheetData = {
            ...baseData.item,
            "config": CONFIG.MYRIADSONG,
            "descriptors": descriptors
        }

        return sheetData;
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