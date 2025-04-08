import { Bot } from "grammy";
import cron from "node-cron";
import dotenv from "dotenv";
import { fetchPrettyMenu } from "@torus/caltech-dining-api";

dotenv.config();

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const sheetsApiKey = process.env.SHEETS_API_KEY;

const bot = new Bot(token);

const formatMenu = (menu) => {
    return Object.keys(menu)
        .map((key) => {
            return (
                "<u>" +
                key.charAt(0).toUpperCase() +
                key.slice(1) +
                "</u>:\n" +
                menu[key].map((item) => item.dish).join("\n")
            );
        })
        .join("\n\n");
};

const postMenu = (destChat = chatId) => {
    const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    const today = new Date().getDay();
    const dayOfWeek = daysOfWeek[today];

    fetchPrettyMenu(sheetsApiKey).then((menu) => {
        const menuForToday = menu[dayOfWeek];
        if (!menuForToday) {
            bot.api.sendMessage(destChat, "No menu available for today.");
            return;
        }
        bot.api.sendMessage(destChat, `<u>Menu for Today</u>: \n\n${formatMenu(menuForToday)}`, {
            parse_mode: "HTML"
        });
    });
};

cron.schedule("30 17 * * 1-5", () => {
    postMenu();
});

// Command handlers
bot.command("start", (ctx) => {
    ctx.reply("i love lateplates");
});

bot.command("menu", (ctx) => {
    postMenu(ctx.chat.id);
});

bot.command("wee", (ctx) => {
    ctx.reply("/hoo");
});

bot.command("hoo", (ctx) => {
    ctx.reply("/wee");
});

// Start the bot
bot.start();
