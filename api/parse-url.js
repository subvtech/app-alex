const express = require('express');
const parser = require('@postlight/mercury-parser');

const app = express();

app.use(express.json());

app.post('/api/parse-url', function (req, res) {
  parser
    .parse(req.body.url)
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
});

module.exports = app;
