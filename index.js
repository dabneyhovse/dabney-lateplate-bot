import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import dotenv from "dotenv";
import { fetchMenu, fetchPrettyMenu } from "@torus/cds-api";

dotenv.config();

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const sheetsApiKey = process.env.SHEETS_API_KEY;

console.log(sheetsApiKey)

const bot = new TelegramBot(token, { polling: true });

const formatMenu = (menu) => {
    return Object.keys(menu).map(key => {
        return key.charAt(0).toUpperCase() + key.slice(1) + ':\n' + menu[key].map((item) => item.dish).join('\n');
    }).join('\n\n');
};

const postMenu = () => {
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    const dayOfWeek = daysOfWeek[today];

    fetchPrettyMenu(sheetsApiKey).then(menu => {
        const menuForToday = menu[dayOfWeek];
        bot.sendMessage(chatId, formatMenu(menuForToday));
    });
};

cron.schedule('0 8 * * 1-5', () => {
    postMenu();
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'i love lateplates');
});

