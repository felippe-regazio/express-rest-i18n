const i18nCreate = require('../dist/');
const messages = require('./messages.js');

// ------------------------------------------

let i18n = undefined;

beforeEach(() => {
  i18n = i18nCreate({
    messages: messages,
    defaultLocale: 'pt-br'
  });
});

// ------------------------------------------

test('Test i18n creation options must be valid', () => {
  expect(i18nCreate).toThrow(Error);

  expect(() => i18nCreate({})).toThrow(Error);
  expect(() => i18nCreate('test')).toThrow(Error);
  expect(() => i18nCreate({ messages: { test: '' }, defaultLocale: '' })).toThrow(Error);
  expect(() => i18nCreate({ messages: 'messages', defaultLocale: [] })).toThrow(Error);
  expect(() => i18nCreate({ messages, defaultLocale: 'fr' })).toThrow(Error);
  expect(() => i18nCreate({ messages: {}, defaultLocale: 'en' })).toThrow(Error);
  expect(() => i18nCreate({ messages, defaultLocale: 'fr' })).toThrow(Error);

  expect(i18n).toBeDefined();
});

test('i18n.setOptions must revalidate and change instance', () => {
  expect(() => i18n.setOptions({ messages: 'fr' })).toThrow(Error);
  expect(() => i18n.setOptions({ defaultLocale: 'fr' })).toThrow(Error);
  expect(() => i18n.setOptions({ messages: {}, defaultLocale: 'pt-br' })).toThrow(Error);

  expect(i18n.locale()).toBe('pt-br');
  i18n.setOptions({ defaultLocale: 'en' });
  expect(i18n.locale()).toBe('en');
  i18n.setOptions({ messages: { 'fr': {} }, defaultLocale: 'fr' });
  expect(i18n.locale()).toBe('fr');
});

/* test('Test i18n creation options', () => {
  i18n.setOptions();

  console.log(i18n)
}); */