client.on(Events.InteractionCreate, async interaction => {
if (!interaction.isChatInputCommand()) return;

```
if (interaction.commandName === "genkeys") {

    if (interaction.user.id !== process.env.1512832111340683383) {
        return interaction.reply({
            content: "❌ Only the owner can generate keys.",
            ephemeral: true
        });
    }

    const dayKeys = [];
    const weekKeys = [];
    const monthKeys = [];
    const lifetimeKeys = [];

    for (let i = 0; i < 25; i++) {
        dayKeys.push(generateKey("Day"));
        weekKeys.push(generateKey("Week"));
        monthKeys.push(generateKey("Month"));
        lifetimeKeys.push(generateKey("Lifetime"));
    }

    const output =
```

`🔑 1 Day Keys
${dayKeys.join("\n")}

🔑 1 Week Keys
${weekKeys.join("\n")}

🔑 1 Month Keys
${monthKeys.join("\n")}

🔑 Lifetime Keys
${lifetimeKeys.join("\n")}`;

````
    await interaction.reply({
        content: "```" + output + "```",
        ephemeral: true
    });
}
````

});
