import logging
import os

from dotenv import load_dotenv
from telegram.ext import (
    Application,
    ApplicationBuilder,
    CommandHandler,
)

from lateplate.handlers.start import handle_start

load_dotenv()

BOT_TOKEN = os.getenv("TG_TOKEN", "")

logging.getLogger("httpx").setLevel(logging.WARNING)
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)


async def post_init(app: Application) -> None:
    app.add_handler(CommandHandler("start", handle_start))


def main() -> None:
    app = (
        ApplicationBuilder()
        .token(BOT_TOKEN)
        .arbitrary_callback_data(True)
        .post_init(post_init)
        .build()
    )
    app.run_polling()


if __name__ == "__main__":
    main()
