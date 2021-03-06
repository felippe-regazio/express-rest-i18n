module.exports = function i18n (options = {}) {
  let _options = validateOptions(options);

  function validateOptions(options) {
    ['messages', 'defaultLocale'].forEach(k => {
      if (!options[k]) {
        throw new Error(`i18n: The option "${k}" cannot be empty.`);
      }
    });

    if (typeof options !== 'object') {
      throw new Error('i18n: Invalid options arguments.');
    }

    if (typeof options.messages !== 'object' || !Object.keys(options.messages)) {
      throw new Error('i18n: Messages must be a valid object.');
    }

    if (typeof options.defaultLocale !== 'string') {
      throw new Error('i18n: Default locale must be a string.');
    }

    if (!options.messages[options.defaultLocale]) {
      throw new Error('i18n: The default locale doesn\'t exists on messages.')
    }

    const defaults = {
      warn: false,
      allowFallback: true,
      requestReadLocaleFrom: {
        header: 'application-language',
        query: 'locale',
        body: 'locale',
      }
    };

    return { ...defaults, ...options }
  }

  function setOptions (options) {
    _options = validateOptions({ ..._options, ...options });
  }

  function getDefaultLocale () {
    return _options.defaultLocale;
  }

  function warn (msg) {
    _options.warn && console.warn(msg);
  }

  function translate (keyref, locale = getDefaultLocale()) {
    if (!keyref || typeof keyref !== 'string' || keyref.trim().includes(' ')) {
      return keyref;
    }
    
    const keypath = `${locale}.${keyref}`;
    const translated = objectValueFromStr(keypath, _options.messages);
    const doFallback = !translated && locale !== getDefaultLocale();

    if (doFallback && _options.allowFallback === true) {
      return translateFallback(keyref);
    } else {
      return translated && typeof translated === 'string' ? translated : keyref;
    }
  }
  
  function translateFallback (keyref) {
    warn(`i18n: key "${keyref}" retrieved from default locale as fallback.`);
    
    return translate(keyref);
  }

  function objectValueFromStr(strKey, obj) {
    let val = undefined;
    try {
      val = strKey
        .split('.')
        .reduce((o, i) => o[i], obj);
    } catch (err) {
      warn(`i18n: Failed to translate "${strKey}"`);
    };

    return val;
  }

  function readLocaleFromReq(req) {
    const opt = _options.requestReadLocaleFrom;
    
    let locale = req.headers[opt.header];
    
    if (!locale) {
      const fromQuery = objectValueFromStr(`query.${opt.query}`, req);
      const fromBody = objectValueFromStr(`body.${opt.query}`, req);

      locale = fromQuery || fromBody;
    }

    return locale;
  }
  
  function middleware(req, res, next) {
    const locale = readLocaleFromReq(req) || getDefaultLocale();
  
    const i18nApi = {
      locale,
      setOptions,

      t(keyref, _locale = locale) {
        return translate(keyref, _locale);
      }
    };
  
    req.i18n = i18nApi;
    res.i18n = i18nApi;
  
    next();
  }
  
  return {
    middleware,
    setOptions,
    t: translate,
    locale: getDefaultLocale,
  };
}