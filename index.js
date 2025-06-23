
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Twitch Screenshot API is running!');
});

app.get('/screenshot', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('URL is required.');

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForTimeout(5000); // Espera carregar o player

  const screenshot = await page.screenshot({ type: 'jpeg' });
  await browser.close();

  res.set('Content-Type', 'image/jpeg');
  res.send(screenshot);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
