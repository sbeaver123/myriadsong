
import { MyriadSongActorSheet } from "./actor-sheet.js";

export class MyriadSongNpcSheet extends MyriadSongActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["myriadsong", "sheet", "npc"],
            dragDrop: [{
                dragSelector: ".item-list .item",
                dropSelector: null,
                permissions: { dragstart: () => true }
            }],
            height: 850,
            width: 740
        });
    }

    get template() {
        return "systems/myriadsong/templates/actor/npc-sheet.hbs";
    }

    getData(options) {
        const baseData = super.getData(options);

        let sheetData = {
            ...baseData.actor,
            diceroller: this.diceRoller,
            config: CONFIG.MYRIADSONG
        }

        if (baseData.actor.hasOwnProperty("items")) {
            
            const giftList = baseData.actor.items.filter(function (item) { return item.type == "gift"});
            sheetData.gifts = this._getGiftData(giftList);
            
            const attackList = baseData.actor.items.filter(function (item) { return item.type == "weapon"});
            sheetData.attacks = this._getAttackData(attackList);
            
            sheetData.counters = baseData.actor.items.filter(function (item) { return item.type == "npccounter"});
        }

        console.log(sheetData);
        return sheetData;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".toggle").click(event => {this.toggleGiftDesc(event)});

        html.find(".weapon-dice").change(event => this.changeWeaponDice(event));
        html.find(".attack-roll").click(event => this.attackRoll(event));

        html.find(".diceroll").click(event => this.diceRoll(event));
    }

    attackRoll(event) {
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        this._showDicePoolDialogWithDice(item.system.pool, item.name);
    }

    async changeWeaponDice(event) {
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        await item.update({["system.pool"]: element.value});
    }

    diceRoll(event) {
        const attribute = event.currentTarget.dataset.attr;
        const system = this.actor.system;
        
        let formula = "";
        if (attribute == "counter") {
            formula = system.counter.formula;
        } else {
            formula = system.battlearray[attribute];
        }

        const label = "MYRIADSONG." + attribute;
        this._showDicePoolDialogWithDice(formula, game.i18n.localize(label));
    }

    _getGiftData(giftList) {

        let gifts = [];
        for(let x=0; x < giftList.length; x++) {
            let gift = giftList[x];
            gift.system.costString = game.i18n.localize("MYRIADSONG.giftcost." + gift.system.cost);
            gifts.push(gift);
        }
        return gifts;
    }

    _getAttackData(attackList) {
        let attacks = [];
        for(let x=0;x < attackList.length; x++) {
            let attack = attackList[x];

            let effects = "";
            attack.system.effects.forEach((value,index,array) => {
                effects += game.i18n.localize("MYRIADSONG.effect." + value);
                if (index < (array.length - 1)) {
                    effects += ", ";
                }
            });
            attack.system.effectString = effects;

            attacks.push(attack);
        }
        return attacks;
    }
}