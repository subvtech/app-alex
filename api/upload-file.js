import 'dotenv/config';

import express from 'express';
import fileUpload from 'express-fileupload';
import Strapi from 'strapi-sdk-js';
import FormData from 'form-data';

const { STRAPI_URL } = process.env;
const strapi = new Strapi(STRAPI_URL);
const app = express();

app.use(express.json());
app.use(fileUpload());

app.post('/api/upload-file', function (req, res) {
  const headerToken = req.headers.authorization;
  const queryToken = req.query.token;

  const { file } = req.files || {};

  if ((!headerToken && !queryToken) || !file) {
    return res.json({ success: 0 });
  }

  const token = headerToken || `Bearer ${queryToken}`;

  const form = new FormData();

  form.append('files', file.data, file.name);

  strapi
    .upload(form, {
      headers: { authorization: token, ...form.getHeaders() },
    })
    .then((file) => {
      const response = {
        success: 1,
        file: {
          extension: file[0].ext,
          ...file[0],
          name: `${file[0].name}`,
        },
      };

      response.file.url = `${response.file.url}`;

      if (response.file.formats) {
        response.file.formats.thumbnail.url = `${response.file.formats.thumbnail.url}`;
        response.file.formats.medium.url = `${response.file.formats.medium.url}`;
        response.file.formats.small.url = `${response.file.formats.small.url}`;
      }

      return res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: 0 });
    });
});

module.exports = app;
