module.exports = {
  'pt-br': {
    test: 'Teste',
    existentKey: 'Chave existente',
    fallbackPtBr: 'Fallback pt-br ok!',
    nested: {
      msg: 'Primeiro nível',
      secondLevel: {
        msg: 'Segundo nível'
      }
    }
  },

  'en': {
    test: 'Test',
    existentKey: 'Existent key',
    fallbackEn: 'Fallback en ok!',
    nested: {
      msg: 'First level',
      secondLevel: {
        msg: 'Second level'
      }
    }
  }
}