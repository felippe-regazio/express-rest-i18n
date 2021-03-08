# Express Rest i18n

Dead simple i18n middleware for Express REST APIs.  
Easy API, no dependencies, simple integration and well tested. 

# Getting Started

#### 1. Add the dependency

```bash
npm install express-rest-i18n
```

#### 2. Create the i18n instance.

You can also create a module that exports you instance, if you prefer.

```js
const i18nCreate = require('express-rest-i18n');

const i18n = i18nCreate({
  defaultLocale: 'pt-br',
  warn: false, // optional
  allowFallback: true, // optional
  messages: {
    'en': {
      hello: 'Hello',
      nested: {
        world: 'World'
      }
    },

    'pt-br': {
      hello: 'Olá',
      nested: {
        world: 'Mundo'
      }
    }
  },
});
```

#### 4. Add the i18n Middeware on Express

```js
const express = require('express');

const app = express();

app.use(i18n.middleware);
```

Attention: if are using `body-parser`, add the i18n middleware AFTER the body parser addition, so the i18n will recognize it.

#### 5. Use it

```js
app.get('*', (req, res) => {
  const helloWorld = `${res.i18n.t('hello')} ${res.i18n.t('nested.world')}`;

  res.status(200).send(helloWorld);  
});
```

# Locales

If you dont pass any locale, your `defaultLocale` will be used as the translation language. Anyway, you can specify a locale to your API in 3 different ways. When specifying the locale on your request you dont need to do anything server-side, the `i18n.t()` will automatically handle the response using the locale passed via request.

#### Headers

You can pass the API language (locale) from the request headers, just set the `application-language` on headers passing the desired locale, in the example below, we are saying that we want the results in "en" language:

```js
fetch('http://api-address.com/', {
  headers: { 'application-language': 'en' }
})
  .then(response => { ... })
  .catch(err => { ... });
```

#### Query

You can pass the desired locale via address query. In the example below you will be setting the results to "en" language:

```js
fetch('http://api-address.com/?locale=en')
  .then(response => { ... })
  .catch(err => { ... });
```

### Body

You can also pass the desired locale on your request body. You must be using `body-parser` on your express to use this option:

```js
fetch('http://api-address.com/', {
  method: 'post',
  body: JSON.stringify({ locale: 'en' })
})
  .then(response => { ... })
  .catch(err => { ... });
```

# Locale fallback

The `defaultLocale` will be used as a fallback when you:

1. Doesn't specify any locale
2. Pass a locale that doesn't exists on your `messages`
3. Pass a `key` to be translated which doesn\'t exists on the current locale (not the default)

# Usage

#### Locales and Messages

Your `messages` are passed to the `i18n instance` using the `messages` key on options.
A common approach is to put the messages in a separated file. In the messages object, 
the first key level is the locale, and the nested keys are the messages. Example:

```js
// messages.js file
module.exports = {
  'en': { // locale
    hello: 'Hello',
    nested: {
      world: 'World'
    }
  },

  'pt-br': { // locale
    hello: 'Olá',
    nested: {
      world: 'Mundo'
    }
  }
}
```

Then on your instance creation:

```js
const message = require('./messages.js');

const i18n = i18nCreate({
  messages: messages,
  defaultLocale: 'pt-br'
});
``` 