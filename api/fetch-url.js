import express from 'express';
import { parse } from '@postlight/parser';

const app = express();

app.use(express.json());

app.get('/api/fetch-url', function (req, res) {
  parse(req.query.url)
    .then((data) => {
      const domain =
        data.domain && typeof data.domain === 'string' ? data.domain : '';

      const parsed = {
        success: 1,
        meta: {
          title: data.title,
          domain,
          description: data.excerpt,
          image: data.lead_image_url ? { url: data.lead_image_url } : undefined,
        },
      };

      res.status(200).json(parsed);
    })
    .catch(() => res.status(500).json({ success: 0 }));
});

export default app;
