
export const preloadTemplates = async function () {

    const templatePaths = [
        "systems/myriadsong/templates/actor/profile-tab.hbs",
        "systems/myriadsong/templates/actor/skills-tab.hbs",
        "systems/myriadsong/templates/actor/gifts-tab.hbs",
        "systems/myriadsong/templates/actor/battlearray-tab.hbs",
        "systems/myriadsong/templates/item/gift-sheet.hbs"
    ];

    return loadTemplates(templatePaths);
}