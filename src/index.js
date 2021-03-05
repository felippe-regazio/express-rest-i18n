/**
 * This is a dead simple internationalization module for Express.
 * It is intended to be used on REST APIs. Check the GitHub repo
 * for further information.
 *
 * You may have noticed that there is a class which wraps all
 * the application. The idea here is that when we run this file, 
 * it will run once, create the new instance of the i18n, and save 
 * it in the cache. That means that Node JS will automatically 
 * handle exporting the same instance of the i18n to every other 
 * module that wants to consume it, so we have a singleton for free.
 * 
 * @author Felippe Regazio
 * @github https://github.com/felippe-regazio/express-rest-i18n
 */
class SingletonI18n {

  constructor (options) {
    return _create(options);
  }

  _create (options = {}) {
    const _options = applyDefaultOptions(options);
  
    function applyDefaultOptions(options) {
      const defaults = {
        messages: {},
        defaultLocale: '',
        requestReadLocaleFrom: {
          header: 'application-language',
          query: 'locale',
          body: 'locale',
        }
      };
  
      return { ...defaults, ...options }
    }
  
    function setOptions (options) {
      return { ..._options, options };
    }
  
    function translate (keyref, locale = getDefaultLocale()) {
      if (!keyref || typeof keyref !== 'string' || keyref.trim().includes(' ')) {
        return keyref;
      }
      
      const translated = objectValueFromStr(`${locale}.${keyref}`, _options.messages);
      const doFallback = !translated && locale !== getDefaultLocale();
    
      return doFallback ? translateDefault(keyref) : (translated || keyref);
    }
    
    function translateDefault (keyref) {
      console.warn(`i18n: key "${locale}.${keyref}" retrieved from default locale as fallback.`);
      
      return translate(keyref);
    }
  
    function objectValueFromStr(strKey, obj) {
      let val = undefined;
  
      try {
        val = strKey
          .split('.')
          .reduce((o, i) => o[i], obj);
      } catch (err) {
        console.error(err);
      };
  
      return val;
    }
  
    function readLocaleFromReq(req) {
      const opt = _options.requestReadLocaleFrom;
      
      let locale = req.headers[opt.header];
      let searchOnReq = [ `body.${opt.body}`, `query.${opt.query}` ];
  
      while(!locale || searchOnReq.length) {
        locale = objectValueFromStr(searchOnReq.pop(), req);
      }
  
      return locale;
    }
    
    function middleware(req, res, next) {
      const locale = readLocaleFromReq(req) || getDefaultLocale();
    
      const i18nApi = {
        locale,
  
        t(keyref, locale) {
          return translate(keyref, locale);
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
}

module.exports = options => new SingletonI18n(options);