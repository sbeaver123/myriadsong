
export class MyriadSongActor extends Actor {

    _onUpdate(data, options, userId) {
        super._onUpdate(data, options, userId);
        this.calculateBattleArray();
    }

    async calculateBattleArray() {
        const system = this.system;
        let battlearray = {
            "initiative": "",
            "stride": "",
            "dash": "",
            "scramble": "",
            "run": "",
            "counter": "",
            "dodge": "",
            "soak": "",
            "rally": ""
        };
        let initiative = "";
        let stride = 0;
        let dash = 0;
        let scramble = "";
        let run = 0;
        let counter = "";
        let dodge = "";
        let soak = "";
        let rally = "";

        if (this.type == "character") {
            if (system.body == 0 && system.speed == 0 && system.mind == 0) {
                return {};
            }
            
            initiative = "d" + system.speed + "+" + "d" + system.mind;
            stride = "1";
            dash = (system.speed / 2) + (system.body > system.speed ? 1 : 0);
            scramble = "d" + system.body + "+" + "d" + system.speed;
            run = parseInt(dash) + parseInt(system.body) + parseInt(system.speed);
            
            const evasion = this.getSkillDice("evasion");
            const tactics = this.getSkillDice("tactics");

            dodge = "d" + system.speed;
            if (evasion != "") {
                dodge = dodge + "+" + evasion;
            }
            soak = "d" + system.body;
            
            rally = "d" + system.will;
            if (tactics != "") {
                rally = rally + "+" + tactics;
            }

            battlearray = {
                "initiative": initiative,
                "stride": stride,
                "dash": dash,
                "scramble": scramble,
                "run": run,
                "counter": counter,
                "dodge": dodge,
                "soak": soak,
                "rally": rally
            }

        } else if (this.type == "npc") {

           battlearray = system.battlearray;
        }

        await this.update({["system.battlearray"]: battlearray});
    }

    getSkillDice(skill) {

        const skillData = this.system.skills[skill];

        let formula = "";
        if (skillData.marksDice != "") {
            formula = skillData.marksDice;
        }
        if (skillData.legacyDice != "") {
            if (formula == "") {
                formula = skillData.legacyDice;
            } else {
                formula = formula + "+" + skillData.legacyDice;
            }
        }
        if (skillData.careerDice != "") {
            if (formula == "") {
                formula = skillData.careerDice;
            } else {
                formula = formula + "+" + skillData.careerDice;
            }
        }

        return formula;
    }
}