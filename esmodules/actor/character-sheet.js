
import { MyriadSongActorSheet } from "./actor-sheet.js";

export class MyriadSongCharacterSheet extends MyriadSongActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["myriadsong", "sheet", "character"],
            dragDrop: [{
                dragSelector: ".item-list .item",
                dropSelector: null,
                permissions: { dragstart: () => true }
            }],
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "profile"}],
            height: 970,
            width: 970
        });
    }

    constructor(...args) {
        super(...args);
    }

    get template() {
        return `systems/myriadsong/templates/actor/character-sheet.hbs`;
    }

    async getData(options) {
        const baseData = super.getData(options);

        let sheetData = {
            ...baseData.actor,
            diceroller: this.diceRoller,
            config: CONFIG.MYRIADSONG
        }

        if (baseData.actor.hasOwnProperty("items")) {

            sheetData.outfits = baseData.actor.items.filter(function (item) {return item.type == "outfit"});
            
            const giftList = baseData.actor.items.filter(function (item) { return item.type == "gift"});
            sheetData.gifts = await this._getGiftData(giftList);
            
            const weaponList = baseData.actor.items.filter(function (item) { return item.type == "weapon"});
            sheetData.weapons = this._getWeaponData(weaponList);
        }

        console.log(sheetData);
        return sheetData;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".skill-roll").click(event => this.skillRoll(event));
      
        html.find(".marks").change(event => {this.updateMarkDice(event)});

        html.find(".toggle").click(event => {this.toggleGiftDesc(event)});
        html.find(".gift-check").change(event => this.checkGift(event));

        html.find(".battleroll").click(event => this.battleArrayRoll(event));
        html.find(".weapon-dice").change(event => this.changeWeaponDice(event));
        html.find(".weapon-roll").click(event => this.weaponRoll(event));
        html.find(".damage").change(event => this.checkDamageState(event));
    }

    async createItem(event) {
    
        let itemData = {
            name: game.i18n.localize("MYRIADSONG.newitem"),
            type: event.currentTarget.dataset.type,
            system: {
                "description": "New item description"
            }
        }

        const itemArray = [itemData];

        const createdArray = await this.actor.createEmbeddedDocuments("Item", itemArray);
        const newItem = createdArray[0];
        newItem.sheet.render(true);
    }

    deleteItem(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        return this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    }

    editItem(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);

        item.sheet.render(true);
    }

    async updateMarkDice(event) {
        const skillpath = (event.currentTarget.name.substring(0, event.currentTarget.name.lastIndexOf(".")));
        const skill = skillpath.substring(skillpath.lastIndexOf(".")+1);
        
        const marks = event.currentTarget.value;
        
        let skills = this.actor.system.skills;
        skills[skill].marksDice = marksDiceMap.get(marks);

        await this.actor.update({["system.skills"]: skills});
    }

    async checkGift(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;

        if (itemId === "combatsavegift") {
            const check = (this.actor.system.combatsavegift == true ? false : true);
            await this.actor.update({["system.combatsavegift"]: check});
        }
        else if (itemId === "personalitygift") {
            const check = (this.actor.system.personalitygift == true ? false : true);
            await this.actor.update({["system.personalitygift"]: check});
        } else {
            let item = this.actor.items.get(itemId);
            const check = (item.system.check == true ? false : true);
            await item.update({["system.check"]: check});
        }
    }

    skillRoll(event) {
        const skill = event.currentTarget.closest(".skill-roll").dataset.skill;
        const formula = this.actor.getSkillDice(skill);
        const label = game.i18n.localize("MYRIADSONG.skill." + skill);
        this._showDicePoolDialogWithDice(formula, label);
    }

    battleArrayRoll(event) {
        const attribute = event.currentTarget.dataset.attr;
        const formula = this.actor.system.battlearray[attribute];
        const label = game.i18n.localize("MYRIADSONG." + attribute)
        this._showDicePoolDialogWithDice(formula, label);
    }

    async changeWeaponDice(event) {
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        await item.update({["system.pool"]: element.value});
    }

    weaponRoll(event) {
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        const label = item.name;
        const formula = item.system.pool;
        this._showDicePoolDialogWithDice(formula, label);
    }

    async checkDamageState(event) {
        event.preventDefault();
        const state = event.currentTarget.dataset.itemId;
        const newState = this.actor.system.damage[state] == true ? false : true;
        let damage = this.actor.system.damage;
        damage[state] = newState;
        await this.actor.update({["system.damage"]: damage});
    }

    async _getGiftData(giftList) {

        let gifts = [];
        for(let x=0; x < giftList.length; x++) {
            let gift = giftList[x];
            gift.system.costString = game.i18n.localize("MYRIADSONG.giftcost." + gift.system.cost);
            gifts.push(gift);
        }
        return gifts;
    }

    _getWeaponData(weaponList) {

        let weapons = [];
        for(let x=0;x < weaponList.length; x++) {
            let weapon = weaponList[x];

            let effects = "";
            weapon.system.effects.forEach((value,index,array) => {
                effects += game.i18n.localize("MYRIADSONG.effect." + value);
                if (index < (array.length - 1)) {
                    effects += ", ";
                }
            });
            weapon.system.effectString = effects;

            let descriptors = "";
            weapon.system.descriptors.forEach((value,index,array) => {
                descriptors += game.i18n.localize("MYRIADSONG.descriptor." + value);
                if (index < (array.length - 1)) {
                    descriptors += ", ";
                }
            });
            weapon.system.descriptorString = descriptors;

            weapons.push(weapon);
        }
        return weapons;
    }

    async _onDropItem(event, data) {

        if ( !this.actor.isOwner ) {
            return false;
        }

        const item = await Item.implementation.fromDropData(data);
        const itemData = item.toObject();

        let retval = await this._onDropItemCreate(itemData);
    }
}