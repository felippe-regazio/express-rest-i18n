const app = require('./server.js');
const supertest = require('supertest');

module.exports = async (options) => {
  const promises = [];
  const testKeys = options.assert;

  const localeHeaderTitle = options.localeHeader ? 'application-language' : 'X-Whatever';
  const localeHeaderValue = options.localeHeader ? options.localeHeader : 'whatever';
  
  Object.keys(testKeys).forEach(key => {
    promises.push(new Promise(resolve => {
      if (options.method === 'get') {
        supertest(app)
          .get(`/test?translate=${key}&${options.query}`)
          .set(localeHeaderTitle, localeHeaderValue)
          .then(response => resolve(response.text))
          .catch(resolve);
      }

      if (options.method === 'post') {
        supertest(app)
          .post(`/test`)
          .set(localeHeaderTitle, localeHeaderValue)
          .send({ translate: key, ...options.data })
          .then(response => resolve(response.text))
          .catch(resolve);        
      }
    }));
  });

  const result = await Promise.all(promises);

  Object.keys(testKeys).forEach((k, i) => {
    const response = result[i];
    const expected = testKeys[k];

    options.each(response, expected);
  });
};