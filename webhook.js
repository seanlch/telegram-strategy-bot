export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  const body = req.body;

  if (!body || !body.message || !body.message.chat || !body.message.text) {
    console.log("❌ 無效的請求：", body);
    return res.status(200).send('No message');
  }

  const chatId = body.message.chat.id;
  const text = body.message.text.toLowerCase();

  if (text === '/btc') {
    const message = `📊 BTC 分析中...\n（這是測試訊息）`;

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
  }

  return res.status(200).send('OK');
}
