// https://github.com/WebReflection/html-escaper/blob/master/index.js

const { replace } = '';

const esca = {
  ' ': ['&nbsp;', '&#160;'],
  '<': ['&lt;', '&#60;'],
  '>': ['&gt;', '&#62;'],
  '&': ['&amp;', '&#38;'],
  '"': ['&quot;', '&#34;'],
  "'": ['&apos;', '&#39;'],
  '¢': ['&cent;', '&#162;'],
  '£': ['&pound;', '&#163;'],
  '¥': ['&yen;', '&#165;'],
  '€': ['&euro;', '&#8364;'],
  '©': ['&copy;', '&#169;'],
  '®': ['&reg;', '&#174;'],
};

const unes = Object.keys(esca).reduce(function (r, k) {
  return Object.assign(r, {
    [esca[k][0]]: k,
    [esca[k][1]]: k,
  });
}, {});

const pe = (m) => esca[m][0];
const cape = (m) => unes[m];

const en = Object.keys(unes).join('|').replace(/[&;]/g, '');
const ca = new RegExp(`[${Object.keys(esca).join('')}]`, 'g');
const es = new RegExp(`&(?:${en});`, 'g');

export const escape = (es) => replace.call(es, ca, pe);

export const unescape = (un) => replace.call(un, es, cape);
