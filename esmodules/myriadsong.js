
import { MYRIADSONG } from "./config.js";
import { preloadTemplates } from "./templates.js";

import { MyriadSongActor } from "./actor/actor.js";
import { MyriadSongActorSheet } from "./actor/actor-sheet.js";
import { MyriadSongCharacterSheet } from "./actor/character-sheet.js";
import { MyriadSongNpcSheet } from "./actor/npc-sheet.js";
import { MyriadSongItem } from "./item/item.js";
import { MyriadSongItemSheet } from "./item/item-sheet.js";
import { MyriadSongGearSheet } from "./item/gear-sheet.js";
import { MyriadSongGiftSheet } from "./item/gift-sheet.js";
import { MyriadSongNpcAttackSheet } from "./item/npcattack-sheet.js";
import { MyriadSongOutfitSheet } from "./item/outfit-sheet.js";
import { MyriadSongWeaponSheet } from "./item/weapon-sheet.js";

import { chatListeners } from "./chat-listeners.js";

Hooks.once("init", async function() {
    console.log("Initialising Myriad Song");

    CONFIG.Actor.documentClass = MyriadSongActor;
    CONFIG.Item.documentClass = MyriadSongItem;
    
    CONFIG.MYRIADSONG = MYRIADSONG;

    CONFIG.Combat.initiative = {
        formula: "@battlearray.initiative",
        decimals: 0
    };

    console.log(CONFIG);

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("myriadsong", MyriadSongActorSheet, {types: ["actor"], makeDefault: true});
    Actors.registerSheet("myriadsong", MyriadSongCharacterSheet, {types: ["character"]});
    Actors.registerSheet("myriadsong", MyriadSongNpcSheet, {types: ["npc"]});

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("myriadsong", MyriadSongItemSheet, {types: ["item"], makeDefault: true});
    Items.registerSheet("myriadsong", MyriadSongGearSheet, {types: ["gear"]});
    Items.registerSheet("myriadsong", MyriadSongGiftSheet, {types: ["gift"]});
    Items.registerSheet("myriadsong", MyriadSongNpcAttackSheet, {types: ["npcattack"]});
    Items.registerSheet("myriadsong", MyriadSongOutfitSheet, {types: ["outfit"]});
    Items.registerSheet("myriadsong", MyriadSongWeaponSheet, {types: ["weapon"]});

    preloadTemplates();
});

Hooks.on("renderChatLog", (log, html, data) => {
    chatListeners(html);
});

