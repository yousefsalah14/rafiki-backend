const axios = require('axios');

let instance = null;

class TelegramBot {
  constructor(token, chatId) {
    if (!instance) {
      this.bot = axios.create({
        baseURL: `https://api.telegram.org/bot${token}/`,
      });
      this.chatId = chatId;
      instance = this;
    }
    return instance;
  }

  /**
   * Sends a message to the Telegram chat.
   * @param {string} message - The message to be sent.
   * @returns {Promise<boolean>} - A Promise that resolves to true if the message was sent successfully, or false if there was an error.
   */
  _sendMessage(message) {
    return this.bot
      .post('sendMessage', {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
      })
      .then((response) => {
        if (response.status === 200) {
          return true;
        }
        return false;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }
  sendMessage(message) {
    // * try 2 times to send the message if the first time fails
    return this._sendMessage(message).then((success) => {
      if (!success) {
        return this._sendMessage(message);
      }
      return success;
    });
  }
}

module.exports = TelegramBot;
