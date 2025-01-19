require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

// Datenbank-Ersatz
const urlDatabase = {};

// Startseite
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Beispiel-API
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// POST-Endpunkt für URL-Kürzung
app.post('/api/shorturl', function (req, res) {
  const originalUrl = req.body.url;

  // URL-Validierung
  const urlRegex = /^(https?:\/\/)(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // URL speichern und kurze ID generieren
  const shortUrlId = Object.keys(urlDatabase).length + 1;
  urlDatabase[shortUrlId] = originalUrl;

  res.json({ original_url: originalUrl, short_url: shortUrlId });
});

// GET-Endpunkt für Weiterleitung
app.get('/api/shorturl/:shortUrl', function (req, res) {
  const shortUrlId = req.params.shortUrl;
  const originalUrl = urlDatabase[shortUrlId];

  if (!originalUrl) {
    return res.json({ error: 'invalid url' });
  }

  res.redirect(originalUrl);
});

// Server starten
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
