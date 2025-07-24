const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('btc', async (ctx) => {
  try {
    const res = await axios.get('https://api.bitget.com/api/v2/market/ticker?symbol=BTCUSDT');
    const price = parseFloat(res.data.data.last).toFixed(2);
    ctx.reply(`BTC/USDT 当前价格为: $${price}`);
  } catch (error) {
    ctx.reply('❌ 无法取得 Bitget 数据');
  }
});

bot.on('text', (ctx) => {
  ctx.reply('請輸入 /btc 查詢 BTC 價格。');
});

exports.handler = async (req, res) => {
  if (req.method === 'POST') {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } else {
    res.status(200).send('Bot is running.');
  }
};