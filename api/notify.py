import os
import telebot
from flask import Flask

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
# Aceita tanto CHAT_ID quanto CHAT_ID_DONO
CHAT_ID = os.getenv("CHAT_ID_DONO") or os.getenv("CHAT_ID")

if TOKEN:
    bot = telebot.TeleBot(TOKEN)
else:
    bot = None

app = Flask(__name__)

@app.route('/api/notify', methods=['GET', 'POST'])
def notify():
    """ Rota isolada que o seu site vai chamar """
    if bot and CHAT_ID:
        try:
            bot.send_message(CHAT_ID, "🔔 Alguém acessou o seu site!")
            return 'Notificação enviada!', 200
        except Exception as e:
            print(f'Erro ao enviar: {e}')
            return f'Erro ao enviar notificação: {e}', 500
    return 'Chat ID ou Token não configurado', 500
