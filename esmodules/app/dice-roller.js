export default class DiceRoller {

    constructor() {
        this._initDicePools();
    }

    clearPool(event) {
        this._initDicePools();
    }

    addDice (formula) {
        const parsed = this._parseFormula(formula);
        const dice = parsed.split("+");
        dice.forEach((item) => {
            this.dicepool[item]++;
        });
    }

    decreaseFunctionDice() {
        if (this.functionDice.number > 0) {
            this.functionDice.number--;
        }
    }

    increaseFunctionDice() {
        this.functionDice.number++;
    }

    decreasePool(die) {
        if (this.dicepool[die] > 0) {
            this.dicepool[die]--;
        }
    }

    increasePool(die) {
        this.dicepool[die]++;
    }

    toggleFavUse() {
        this.favuse = (this.favuse == false) ? true : false;
    }

    async rollDicePool() {
        const formula = this._buildFormula();
        const roll = new Roll(formula);       
        await roll.evaluate();

        // Check for botch, all dice come up 1.
        let botch = true;
        let maxRoll = 0;
        for (let i in roll.dice) {
            let dieRoll = roll.dice[i].results[0].result;
            if ( dieRoll > 1) {
                botch = false;
            }
            if ( dieRoll > maxRoll) {
                maxRoll = dieRoll;
            }
        }

        // Roll function dice, glitch if any of them roll 1.
        let glitch = false;
        if (this.functionDice.die != "none") {
            const functionString = this.functionDice.number + this.functionDice.die;
            const functionRoll = new Roll(functionString);
            await functionRoll.evaluate();

            let glitch = false;
            for (let i in functionRoll.dice) {
                if (functionRoll.dice[i].results[0].result == 1) {
                    glitch = true;
                    break;
                }
            }
        }

        let tie = false;
        if (maxRoll == this.difficulty && roll.total == 0) {
            tie = true;
        }

        const rollData = {
            "successes": roll.total,
            "tie": tie,
            "botch": botch,
            "glitch": glitch,
            "favuse": this.favuse,
            "roll": roll
        }

        return rollData;
    }

    async rollDicePoolAndDamage(weapon) {

        const rollData = rollDicePool();

        let damage = 0;
        if (weapon.type == "flat") {
            damage = weapon.damage;
        } else {
            if (weapon.hasEffect())
            damage = (rollData.successes + weapon.damage);
        }
    }

    takeRote() {

        let count = 0;

        for (let i=0; i < this.dicepool.d4; i++) {
            if (difficulty < 4) {
                count++;
            }
        }
        for (let i=0; i < this.dicepool.d6; i++) {
            if (difficulty < 6) {
                count++;
            }
        }
        for (let i=0; i < this.dicepool.d8; i++) {
            if (difficulty < 8) {
                count++;
            }
        }
        for (let i=0; i < this.dicepool.d10; i++) {
            if (difficulty < 10) {
                count++;
            }
        }
        for (let i=0; i < this.dicepool.d12; i++) {
            if (difficulty < 12) {
                count++;
            }
        }

        const successes = Math.floor(count / 2);
    }

    setDifficulty(diff) {
        this.difficulty = diff;
    }

    setFunctionDie(die) {
        this.functionDice.die = die;
    }

    setFunctionEffect(effect) {
        this.functionDice.effect = effect;
    }

    _buildFormula() {
        let formula = "";
        for (let i = 0; i < this.dicepool.d4; i++) {
            formula += "d4cs>" + this.difficulty + "+";
        }
        for (let i = 0; i < this.dicepool.d6; i++) {
            formula += "d6cs>" + this.difficulty + "+";
        }
        for (let i = 0; i < this.dicepool.d8; i++) {
            formula += "d8cs>" + this.difficulty + "+";
        }
        for (let i = 0; i < this.dicepool.d10; i++) {
            formula += "d10cs>" + this.difficulty + "+";
        }
        for (let i = 0; i < this.dicepool.d12; i++) {
            formula += "d12cs>" + this.difficulty + "+";
        }

        formula = formula.slice(0, -1);
        return formula;
    }

    _initDicePools() {
        this.dicepool = {
            "d4": 0,
            "d6": 0,
            "d8": 0,
            "d10": 0,
            "d12": 0
        }

        this.functionDice = {
            "die": "none",
            "number": 0,
            "effect": "none"
        }

        this.difficulty = 3;
        this.favuse = false;
    }

    _parseFormula(formula) {
        let parsed = "";
        const items = formula.split("+");
        items.forEach((item) => {
            if (item.startsWith("d")) {
                parsed += (item + "+");
            } else {
                let pos = item.indexOf("d");
                let count = item.substring(0,pos);
                let clause = item.substring(pos);
                for (let i = 0; i < count; i++) {
                    parsed += clause + "+";
                }
            }
        });

        parsed = parsed.slice(0, -1);
        return parsed;
    }
}