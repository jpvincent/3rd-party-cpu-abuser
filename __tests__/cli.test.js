const cpuAbuser = require('../index')
const mockPath = './__tests__/__mocks__/trace-vanity-mobile.json'
const cmd = require('node-cmd')


describe('Cli executable output', () => {
	jest.setTimeout(20000)

  it('default options snapshot test', () => {
    // http://riaevangelist.github.io/node-cmd/
    return new Promise( (resolve, reject) => {
      cmd.get(`node cli.js ${mockPath}`, (err, output, stderr) => {
        if(err) return reject(stderr)
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })

  it('options -t=0 snapshot test', () => {
    return new Promise( (resolve, reject) => {
      cmd.get(`node cli.js ${mockPath} -t=0`, (err, output, stderr) => {
        if(err) return reject(stderr)
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })

  it('options --min-time=0 snapshot test', () => {
    return new Promise( (resolve, reject) => {
      cmd.get(`node cli.js ${mockPath} --min-time=0`, (err, output, stderr) => {
        if(err) return reject(stderr)
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })

  it('options --json snapshot test', () => {
    return new Promise( (resolve, reject) => {
      cmd.get(`node cli.js ${mockPath} --json`, (err, output, stderr) => {
        if(err) return reject(stderr)
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })

  it('options --groupBy EventName snapshot test', () => {
    return new Promise( (resolve, reject) => {
      cmd.get(`node cli.js ${mockPath} --groupBy EventName`, (err, output, stderr) => {
        if(err) return reject(stderr)
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })

  it('options --endMark firstPaint snapshot test', () => {
    return new Promise( (resolve, reject) => {
      cmd.get(`node cli.js ${mockPath} --endMark firstPaint`, (err, output, stderr) => {
        if(err) return reject(stderr)
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })

  it('options --startMark loadEventEnd --min-time=50 snapshot test', () => {
    return new Promise( (resolve, reject) => {
      cmd.get(`node cli.js ${mockPath} --startMark loadEventEnd --min-time=50`, (err, output, stderr) => {
        if(err) return reject(stderr)
        expect(output).toMatchSnapshot()
        return resolve()
      })
    })
  })

})
