// api/webhook.js
const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('Telegram bot webhook is running ✅');
  }

  const { message } = req.body;
  const chatId = message?.chat?.id;
  const text = message?.text;

  if (!chatId || !text) return res.status(200).send('Invalid Telegram message');

  if (text === '/btc') {
    try {
      const response = await axios.get('https://api.bitget.com/api/v2/market/ticker?symbol=BTCUSDT');
      const price = response.data.data.last;

      await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: `🪙 BTC 現價：${price}`
      });

      return res.status(200).send('Message sent');
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).send('Error fetching price');
    }
  }

  return res.status(200).send('Command not handled');
};
