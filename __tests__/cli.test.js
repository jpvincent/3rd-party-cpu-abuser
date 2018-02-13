const cpuAbuser = require('../index')
const mockPath = 'samples/VA-article.json'
const cmd = require('node-cmd')


describe('Cli executable output', () => {
	jest.setTimeout(20000)

  it('default options snapshot test', () => {
    // http://riaevangelist.github.io/node-cmd/
    return new Promise( (resolve, reject) => {
      cmd.get('node cli.js '+mockPath, (output) => {
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })

  it('options -t=0 snapshot test', () => {
    return new Promise( (resolve, reject) => {
      cmd.get(`node cli.js ${mockPath} -t=0`, (output) => {
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })

  it('options --min-time=0 snapshot test', () => {
    return new Promise( (resolve, reject) => {
      cmd.get(`node cli.js ${mockPath} --min-time=0`, (output) => {
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })

  it('options --json snapshot test', () => {
    return new Promise( (resolve, reject) => {
      cmd.get(`node cli.js ${mockPath} --json`, (output) => {
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })

})
