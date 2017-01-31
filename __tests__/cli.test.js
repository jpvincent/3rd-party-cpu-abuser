const cpuAbuser = require('../index')
const mock = 'samples/VA-article.json'
const cmd = require('node-cmd')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

describe('Cli executable output', () => {
  it('should return the same output', () => {
    // http://riaevangelist.github.io/node-cmd/
    return new Promise( (resolve, reject) => {
      cmd.get('node cli.js '+mock, (output) => {
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })
})
