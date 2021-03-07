const supertest = require('supertest');
const i18nCreate = require('../src/');
const messages = require('./messages.js');
const app = require('./server.js');

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

test('Test non-translatable values on i18n.t() outside the request', () => {
  const emptyObj = {};
  const emptyArr = [];

  expect(i18n.t).toBeDefined();
  expect(i18n.t('')).toBe('');
  expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
  expect(i18n.t()).toBe(undefined);
  expect(i18n.t(1)).toBe(1);
  expect(i18n.t(emptyObj)).toBe(emptyObj);
  expect(i18n.t(emptyArr)).toBe(emptyArr);
  expect(i18n.t('translation with spaces')).toBe('translation with spaces');
  expect(i18n.t('translation//@#$%*()....')).toBe('translation//@#$%*()....');
  expect(i18n.t('', 'en')).toBe('');
  expect(i18n.t('nonexistent.key', 'en')).toBe('nonexistent.key');
  expect(i18n.t(null, 'en')).toBe(null);  
});

test('Test translatable values on i18n.t() outside the request', () => {
  expect(i18n.t('existentKey')).toBe('Chave existente');
  expect(i18n.t('test')).toBe('Teste');
  expect(i18n.t('nested')).toBe('nested');
  expect(i18n.t('nested.msg')).toBe('Primeiro nível');
  expect(i18n.t('nested.secondLevel')).toBe('nested.secondLevel');
  expect(i18n.t('nested.secondLevel.msg')).toBe('Segundo nível');

  i18n.setOptions({ defaultLocale: 'en' });

  expect(i18n.t('existentKey')).toBe('Existent key');
  expect(i18n.t('test')).toBe('Test');
  expect(i18n.t('nested')).toBe('nested');
  expect(i18n.t('nested.msg')).toBe('First level');
  expect(i18n.t('nested.secondLevel')).toBe('nested.secondLevel');
  expect(i18n.t('nested.secondLevel.msg')).toBe('Second level');
  
  i18n.setOptions({ defaultLocale: 'pt-br' }); 
  
  expect(i18n.t('existentKey', 'en')).toBe('Existent key');
  expect(i18n.t('test', 'en')).toBe('Test');
  expect(i18n.t('nested', 'en')).toBe('nested');
  expect(i18n.t('nested.msg', 'en')).toBe('First level');
  expect(i18n.t('nested.secondLevel', 'en')).toBe('nested.secondLevel');
  expect(i18n.t('nested.secondLevel.msg', 'en')).toBe('Second level');  
});

test('Test fallback locale', () => {
  expect(i18n.t('fallbackPtBr', 'en')).toBe('Fallback pt-br ok!');
  i18n.setOptions({ defaultLocale: 'en' });
  expect(i18n.t('fallbackEn', 'pt-br')).toBe('Fallback en ok!');
  i18n.setOptions({ defaultLocale: 'pt-br', allowFallback: false });
  expect(i18n.t('fallbackPtBr', 'en')).toBe('fallbackPtBr');
  i18n.setOptions({ defaultLocale: 'en' });
  expect(i18n.t('fallbackEn', 'pt-br')).toBe('fallbackEn');
});

/* test('Test i18n middleware GET tradution', () => {
  const promises = [];
  
  const ptBrTranslations = {
    'test': 'Teste',
    'existentKey': 'Chave existente',
    'nested.msg': 'Primeiro nível',
    'nested.msg.secondLevel.msg': 'Segundo nível'
  }

  Object.keys(ptBrTranslations).forEach(key => {
    promises.push(supertest(app).get(`/test?translate=${key}`));
  });
});
 */