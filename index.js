require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Events,
    REST,
    Routes,
    SlashCommandBuilder
} = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

function randomPart(length = 4) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }

    return result;
}

function generateKey(type) {
    return `Zero-${randomPart()}-${randomPart()}-${type}`;
}

const commands = [
    new SlashCommandBuilder()
        .setName("genkeys")
        .setDescription("Generate license keys")
        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("License type")
                .setRequired(true)
                .addChoices(
                    { name: "Day", value: "Day" },
                    { name: "Week", value: "Week" },
                    { name: "Month", value: "Month" },
                    { name: "Lifetime", value: "Lifetime" }
                )
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Number of keys")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(1000)
        )
].map(command => command.toJSON());

client.once(Events.ClientReady, async () => {
    console.log(`${client.user.tag} is online`);

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log("Slash commands registered.");
    } catch (err) {
        console.error(err);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "genkeys") {

        if (interaction.user.id !== process.env.OWNER_ID) {
            return interaction.reply({
                content: "❌ Only the owner can generate keys.",
                ephemeral: true
            });
        }

        const type = interaction.options.getString("type");
        const amount = interaction.options.getInteger("amount");

        const keys = [];

        for (let i = 0; i < amount; i++) {
            keys.push(generateKey(type));
        }

        await interaction.reply({
            content:
                `🔑 Generated ${amount} ${type} keys:\n\n` +
                "```" +
                keys.join("\n") +
                "```",
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);
