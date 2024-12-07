
export class MyriadSongGiftSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 620,
            height: 470,
            classes: ["myriadsong", "sheet", "item"]
        });
    }

    get template() {
        return `systems/myriadsong/templates/item/gift-sheet.hbs`;
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