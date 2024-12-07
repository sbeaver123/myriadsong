import DiceRoller from "./dice-roller.js";

export default class DicePoolDialog extends FormApplication {

    constructor(actor) {
        super();
        this.actor = actor;
        this.diceRoller = new DiceRoller();
        this.label = "";
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.classes = ["dicedialog"];
        options.template = "systems/myriadsong/templates/dicepool/dicepooldialog.hbs"; 
        options.width = "464";
        options.height = "640";
        options.title = game.i18n.localize("MYRIADSONG.dice-pool");
        options.closeOnSubmit = true;
        options.id = "DicePoolDialog";
        options.resizable = true;
        return options;
    }

    async getData() {

        const data = {
            "diceroller": this.diceRoller,
            "config": CONFIG.MYRIADSONG,
            "label": this.label
        };

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".label").change(event => this.changeLabel(event));
        html.find(".increase").click(event => this.increasePool(event));
        html.find(".decrease").click(event => this.decreasePool(event));
        html.find(".increase-func").click(event => this.increaseFunc(event));
        html.find(".decrease-func").click(event => this.decreaseFunc(event));
        html.find(".function-die").change(event => this.setFunctionDie(event));
        html.find(".function-effect").change(event => this.setFunctionEffect(event));
        html.find(".attr-button").click(event => this.addAttribute(event));
        html.find(".difficulty").change(event => this.changeDifficulty(event));
        html.find(".clear").click(event => this.clearPool(event));
        html.find(".roll").click(event => this.rollPool(event));
        html.find(".favuse").click(event => this.toggleFavUse(event));
    }

    addAttribute(event) {
        event.preventDefault();
        const attr = event.currentTarget.dataset.attr;
        const die = "d" + this.actor.system[attr];
        this.diceRoller.increasePool(die);
        this.render(false);
    }

    changeDifficulty(event) {
        event.preventDefault();
        const difficulty = event.currentTarget.value;
        this.diceRoller.setDifficulty(difficulty);
        this.render(false);
    }

    changeLabel(event) {
        this.label = event.currentTarget.value;
        this.render(false);
    }

    increasePool(event) {
        const die = $(event.currentTarget).data("die");
        this.diceRoller.increasePool(die);
        this.render(false);
    }

    decreasePool(event) {
        const die = $(event.currentTarget).data("die");
        this.diceRoller.decreasePool(die);
        this.render(false);
    }

    increaseFunc(event) {
        this.diceRoller.increaseFunctionDice();
        this.render(false);
    }

    decreaseFunc(event) {
        this.diceRoller.decreaseFunctionDice();
        this.render(false);
    }

    setFunctionDie(event) {
        const die = event.currentTarget.value;
        this.diceRoller.setFunctionDie(die);
    }

    setFunctionEffect(event) {
        const effect = event.currentTarget.value;
        this.diceRoller.setFunctionEffect(effect);
    }

    clearPool(event) {
        this.diceRoller.clearPool();
        this.label = "";
        this.render(false);
    }

    setLabel(str) {
        this.label = str;
    }

    setPool(formula) {
        this.diceRoller.addDice(formula);
    }

    setFunction(functionData) {
        this.diceRoller.functionDice.die = functionData.die;
        this.diceRoller.functionDice.number = functionData.number;
        this.diceRoller.functionDice.effect = functionData.effect;
    }

    toggleFavUse(event) {
        this.diceRoller.toggleFavUse();
    }

    async rollPool() {

        const rollData = await this.diceRoller.rollDicePool();
        rollData.label = this.label;
        const diceData = this._getDiceData(rollData.roll.dice);
        rollData.diceData = diceData;

        const html = await renderTemplate("systems/myriadsong/templates/dicepool/dicepool-result.hbs", rollData);
        const chatData = {
            user: game.user.id,
            speaker: {
                actor: this.actor.id // Shows character name in dice roll chat message.
            },
            label: game.i18n.localize("MYRIADSONG.dicepool-result"),
            content: html,
            rolls: [rollData.roll]
        };

        const msg = await ChatMessage.create(chatData);
        await msg.setFlag("myriadsong", "rollData", rollData);
    }

    async _updateObject() {
        console.log("updateObject() in dice-pool-dialog");
    }

    _getDiceData(dice) {

        let diceData = [];

        for (let x=0;x<dice.length;x++) {
            const die = dice[x];
            const type = "d" + die.faces;
            const result = die.results[0].result;
            const success = die.results[0].success == true ? true : false;

            const dieData = {
                "idx": x,
                "type": type,
                "result": result,
                "success": success
            }

            diceData.push(dieData);
        }

        return diceData;
    }
}