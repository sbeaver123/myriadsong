
export class MyriadSongGearSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 524,
            height: 330,
            classes: ["myriadsong", "sheet", "item"]
        });
    }

    get template() {
        return `systems/myriadsong/templates/item/gear-sheet.hbs`;
    }

    getData() {
        const baseData = super.getData();

        const sheetData = {
            ...baseData.item,
            "config": CONFIG.MYRIADSONG,
        }

        return sheetData;
    }
}
