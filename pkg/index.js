module.exports = function (options = {}) {
  options = applyDefaultOptions(options);

  function applyDefaultOptions(options) {
    const defaults = {
      fn: 't',
      messages: {},
      defaultLocale: '',
      fallback: undefined,
      requestReadLocaleFrom: {
        header: 'application-language',
        query: 'locale',
        body: 'locale',
      }
    };

    return { ...defaults, ...options }
  }

  function translate (keyref, locale) {
    if (!keyref || typeof keyref !== 'string' || keyref.trim().includes(' ')) {
      return keyref;
    }
      
    if (!locale || !options.messages[locale]) {
      locale = getFallbackLocale();
    }
    
    let translated = keyref;
    let messageKeyPath = `${locale}.${keyref}`;
  
    try {
      translated = messageKeyPath
        .split('.')
        .reduce((o, i) => o[i], options.messages);
    } catch (err) {
      console.error(err);
    };
  
    return translated;
  }

  function getFallbackLocale() {
    const fallback = options.fallback;
      
    if (fallback) {
      console.warn(`Express i18n key "${locale}.${keyref}" retrieved with locale fallback: "${fallback}"`);
      
      return fallback;
    } else {
      throw new Error('There is no locale available for Express REST i18n messages');
    }
  }
  
  function getRequestLocale(req) {
    let locale = req.headers[options.requestReadLocaleFrom.header];
    
    let searchOnReq = [
      `body.${options.requestReadLocaleFrom.body}`, 
      `query.${options.requestReadLocaleFrom.query}`
    ];

    while(!locale || searchOnReq.length) {
      locale = searchOnReq.pop()
        .split('.')
        .reduce((o, i) => o[i], req);
    }

    return locale || options.defaultLocale;
  }
  
  function middleware(req, res, next) {
    const requestLocale = getRequestLocale(req);
  
    const i18nApi = {
      locale: requestLocale,
      [options.fn]: translate(keyref, requestLocale)
    };
  
    req.i18n = i18nApi;
    res.i18n = i18nApi;
  
    next();
  }
  
  return {
    [options.fn]: translate,
    middleware: middleware,
  };
}
