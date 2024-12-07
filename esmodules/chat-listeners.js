
export async function chatListeners (html) {

    html.on("click", ".reroll", (event) => {
        console.log(event);
        let target = $(event.currentTarget);
        let idx = target.attr("data-idx");
        console.log("Idx: " + idx);
        let messageId = target.parents(".message").attr("data-message-id");
        let message = game.messages.get(messageId);
        console.log("Message");
        console.log(message);
        
        let die = message.rolls[0].dice[idx];
        const formula = die.formula;
        let newdie = new die(formula);
        newdie.roll();

        console.log(newdie);
    });
}
