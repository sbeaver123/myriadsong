
import DicePoolDialog from "../app/dice-pool-dialog.js";

export class MyriadSongActorSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
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
        return `systems/myriadsong/templates/actor/${this.actor.type}-sheet.hbs`;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find(".item-create").click(event => this.createItem(event));
        html.find(".item-edit").click(event => this.editItem(event));
        html.find(".item-delete").click(event => this.deleteItem(event));

        const diceroller = html.find("button[id='diceroller']");
        diceroller.on("click", event => this._showDicePoolDialog());
    }

    async createItem(event) {
        console.log("Creating new " + event.currentTarget.dataset.type);
    
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

    skillRoll(event) {
        const skill = event.currentTarget.closest(".skill-roll").dataset.skill;
        console.log(skill);
        const formula = this.actor.getSkillDice(skill);
        const label = game.i18n.localize("MYRIADSONG.skill." + skill);
        this._showDicePoolDialogWithDice(formula, label);
    }

    battleArrayRoll(event) {
        const attribute = event.currentTarget.dataset.attr;
        const formula = this.battleArray[attribute];
        const label = game.i18n.localize("MYRIADSONG." + attribute)
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

    async _showDicePoolDialog(label) {
        console.log("Rendering dice pool dialog");
        const dialog = new DicePoolDialog(this.actor);
        dialog.setLabel(label);
        dialog.render(true);
    }
    
    async _showDicePoolDialogWithDice(formula, label) {
        const dialog = new DicePoolDialog(this.actor);
        dialog.setLabel(label);
        dialog.setPool(formula);
        dialog.render(true);
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

    toggleGiftDesc(event) {
        const tr = $(event.currentTarget).parents(".item");
        const td = $(event.currentTarget);
        const item = this.actor.items.get(tr.data("item-id"));

        if (item.system.description != "") {
            if (td.hasClass("showing")) {
                let desc = td.children(".gift-desc");
                desc.remove();
            } else {
                const descDiv = "<div class=\"gift-desc\">" + item.system.description + "</div>";
                td.append(descDiv);
            }
            td.toggleClass(("showing"));
        }
    }
}