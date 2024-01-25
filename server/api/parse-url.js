import express from 'express';
import Parser  from '@postlight/parser';

const app = express();

app.use(express.json());

app.post('/api/parse-url', function (req, res) {
  parse(req.body.url)
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(500).json({ error }));
});

// module.exports = app;
