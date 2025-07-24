const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

app.post('/webhook', async (req, res) => {
  const message = req.body.message;
  if (!message || !message.text) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text.toLowerCase();

  if (text.startsWith('/')) {
    const coin = text.slice(1).toUpperCase();
    const result = generateStrategy(coin);
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: result,
      parse_mode: "Markdown"
    });
  }

  res.sendStatus(200);
});

function generateStrategy(coin) {
  const price = 100; // 假設價格
  const strategies = [
    { name: '超短線⚡', e: 0.5, tp: 1.1, sl: 1.5 },
    { name: '短期投機🚀', e: 1.5, tp: 3, sl: 2.5 },
    { name: '小波段🌊', e: 2.5, tp: 5, sl: 4.5 },
    { name: '波段🏄', e: 5, tp: 10, sl: 9 },
    { name: '長線🌳', e: 8, tp: 16, sl: 13 }
  ];
  let msg = `💸 *策略分析：${coin}USDT*
=======================
⛳️ *價格*：${price.toFixed(2)}
`;
  strategies.forEach(s => {
    const entry = price - s.e;
    const tp = entry + s.tp;
    const sl = entry - s.sl;
    const rr = ((tp - entry) / Math.abs(entry - sl)).toFixed(2);
    msg += `
------------------------------------
` +
           `*${s.name}*
` +
           `📌 入場：${entry.toFixed(2)}
🎯 目標：${tp.toFixed(2)}
✂️ 止損：${sl.toFixed(2)}
📈 回報比：${rr} 🆗
`;
  });
  return msg;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot server running on port ${PORT}`));