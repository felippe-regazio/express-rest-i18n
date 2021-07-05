# Express Rest i18n

Dead simple i18n middleware for Express REST APIs.  
Easy usage, no dependencies, simple integration and well tested. 

# Getting Started

#### 1. Add the dependency

```bash
npm install express-rest-i18n
```

#### 2. Create the i18n instance.

You can also create a module that exports your instance, if you prefer.

```js
const i18nCreate = require('express-rest-i18n');

const i18n = i18nCreate({
  defaultLocale: 'en',
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

Attention: if you are using `body-parser`, add the i18n middleware AFTER the body parser addition, so the i18n will recognize it.

#### 5. Use it

```js
app.get('*', (req, res) => {
  const helloWorld = `${res.i18n.t('hello')} ${res.i18n.t('nested.world')}`;

  res.status(200).send(helloWorld);  
});
```

# The t() method

The `i18n` instance contains the `t()` method which does the translations for you. When you add the `i18n.middleware` to your express, the `t()` method is exposed on your `req` and `res` objects. This is the `t()` method signature

```js
function t(keypath: string, locale?:string) : str
```

#### The t() instance method

When using the t() method on your i18n instance:

```js
i18n.t('hello'); // will output "Hello"
i18n.t('hello', 'pt-br'); // will output "Olá"
```

#### The t() middleware method

When inside the express (as a middleware), the t() method is exposed on your req and res objects.
The locale is automatically infered from the request, or the defaultLocale will be used:

```js
app.get('*', (req, res) => {
  /*
    if the request doesnt specify any locale, the const hello will be "Hello",
    if specify a locale, the result will be in the given local, for pt-br
    for example, would be "Olá", for a non-existent locale or if the given locale
    doesnt contains the "hello" key, it will be fallbacked to the defaultLocale
  */
  const hello = res.i18n.t('hello');

  res.status(200).send(hello); // will output hello  
});
```

You can also force a locale even using it as a middleware

```js
app.get('*', (req, res) => {
  const hello = res.i18n.t('hello', 'pt-br'); // will return "Olá" no matter the request locale

  res.status(200).send(hello); 
});
```

#### Nesting

You can specify nested paths to translate from your messages

```js
i18n.t('nested.world'); // will output "World"
```

#### Side cases

When a key is not found on the given or default locale, or the argument passed is not a string,
the t() method will return the argument untouched:

```js
i18n.t('non.existing.key'); // will output "non.existing.key"
i18n.t({ test: "test"});  // will output object { test: "test"}
```

# Messages

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
const messages = require('./messages.js');

const i18n = i18nCreate({
  messages: messages,
  defaultLocale: 'pt-br'
});
```

# Response Locales

You can specify a locale when requesting your API in 3 different ways, if you dont pass any locale, your `defaultLocale` will be used as the translation language. When specifying the locale on your request you dont need to do anything server-side, the `i18n.t()` will automatically handle the response using the locale passed via request. So, when asking something from your API, you can tell which language you want in the following ways:

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

#### Body

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

# Options

You can pass the following options to the instance:

```js
const i18n = i18nCreate({
  defaultLocale: 'pt-br', // required, set the default locale
  warn: false, // optional // show warns on fallbacks and errors
  allowFallback: true, // if no fallback
  messages: {}, // your locales and messages
});
```

# Methods

#### t()

Ask for translations. Ex:

```js
i18n.t('hello'); // will output "Hello"
```

#### locale()

Return the current locale being used on instance

```js
i18n.locale(); // will output "en"
```

#### setOptions()

Overrides options on the fly. Example for change default locale and warn levels:

```js
i18n.setOptions({
  warn: true,
  defaultLocale: 'pt-br',
});
```

# Development

The sources are in `src` folder. Start with `npm install`, then: 

#### Build

```
npm run build
```

#### Test

```
npm run test
```

***

Express Rest i18n by Felippe Regazio
