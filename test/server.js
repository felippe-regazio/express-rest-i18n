const app = require('express')();
const i18nCreate = require('./../src/');
const messages = require('./messages.js');
const bodyParser = require('body-parser');

const i18n = i18nCreate({
  messages: messages,
  defaultLocale: 'pt-br'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(i18n.middleware);

app.get('*', (req, res) => {
  const changeDefaultLocale = req.query.defaultLocale;

  if (changeDefaultLocale) {
    req.i18n.setOptions({ defaultLocale: changeDefaultLocale });
  }

  res.status(200).send(res.i18n.t(req.query.translate));  
});

app.post('*', (req, res) => {
  const changeDefaultLocale = req.body.defaultLocale;

  if (changeDefaultLocale) {
    req.i18n.setOptions({ defaultLocale: changeDefaultLocale });
  }

  res.status(200).send(res.i18n.t(req.body.translate));  
});

module.exports = app;