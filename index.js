import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import dotenv from "dotenv";
import { fetchPrettyMenu } from "@torus/caltech-dining-api";

dotenv.config();

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const sheetsApiKey = process.env.SHEETS_API_KEY;

const bot = new TelegramBot(token, { polling: true });

const formatMenu = (menu) => {
    return Object.keys(menu)
        .map((key) => {
            return (
                "__" +
                key.charAt(0).toUpperCase() +
                key.slice(1) +
                "__:\n" +
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
            bot.sendMessage(destChat, "No menu available for today.");
            return;
        }
        bot.sendMessage(destChat, `Menu for Today: ${formatMenu(menuForToday)}`, {
            parse_mode: "MarkdownV2"
        });
    });
};

cron.schedule("30 17 * * 1-5", () => {
    postMenu();
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "i love lateplates");
});

bot.onText(/\/menu/, (msg) => {
    postMenu(msg.chat.id);
});
