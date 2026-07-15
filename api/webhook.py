import os
import telebot
from flask import Flask, request

# Tenta carregar o .env caso esteja rodando localmente (na Vercel não precisa)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
CHAT_ID_DONO = os.getenv("CHAT_ID_DONO")

# Se não tiver o token configurado, não inicializa (evita quebrar a Vercel na build)
if TOKEN:
    bot = telebot.TeleBot(TOKEN)
else:
    bot = None

app = Flask(__name__)

@app.route('/api/webhook', methods=['POST'])
def webhook():
    """ Esta é a rota que o Telegram vai chamar toda vez que alguém mandar mensagem """
    if bot and request.headers.get('content-type') == 'application/json':
        json_string = request.get_data().decode('utf-8')
        update = telebot.types.Update.de_json(json_string)
        bot.process_new_updates([update])
        return 'OK', 200
    else:
        return 'Erro', 403

@app.route('/api/notify', methods=['GET', 'POST'])
def notify():
    """ Rota que o seu site vai chamar para notificar o acesso """
    if bot and CHAT_ID_DONO:
        try:
            bot.send_message(CHAT_ID_DONO, "🔔 Alguém acessou o seu site!")
            return 'Notificação enviada!', 200
        except Exception as e:
            return f'Erro ao enviar notificação: {e}', 500
    return 'Chat ID ou Token não configurado', 500

# Comandos do Bot
@app.route('/', methods=['GET'])
def index():
    return 'Bot do Telegram rodando!', 200

if bot:
    @bot.message_handler(commands=['start', 'help'])
    def send_welcome(message):
        bot.reply_to(message, "Olá! Eu sou um bot rodando na Vercel via Webhook!")

    @bot.message_handler(func=lambda message: True)
    def echo_all(message):
        bot.reply_to(message, f"Você disse: {message.text}")
