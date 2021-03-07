const app = require('express')();
const i18nCreate = require('./../src/');
const messages = require('./messages.js');

const i18n = i18nCreate({
  messages: messages,
  defaultLocale: 'pt-br'
});

app.use(i18n.middleware);

app.get('*', (req, res) => {
  res.status(200).send(res.i18n.t(req.query.translate));  
});

app.post('*', (req, res) => {
  res.status(200).send(res.i18n.t(req.body.translate));  
});