const cpuAbuser = require('../index')
const mock = 'samples/VA-article.json'
const mockResult = require('./mock-output-VA-article.json')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

describe('Common behaviour', () => {
  it('should throw an error if file does not exist', () => {
    expect(cpuAbuser.data({
      file: 'non-existent'
    })).toThrow()
  })
})

describe('Node API with JSON results', () => {
  let result = cpuAbuser.data({
    file: mock
  })

  it('should have a JSON structure', () => {
    //console.log(result)
    expect( result.totalCPUTime ).toBeDefined()
    expect( result.cpuTimePerDomain ).toBeDefined()
  })

  it('timings should be Number', () => {
    //console.log(result)
    expect(result.totalCPUTime).toEqual(expect.any(Number))
    expect(result.cpuTimePerDomain['cdn.taboola.com']).toEqual(expect.any(Number))
  })

  it('should calculate totalCPUTime', () => {
    // console.log(result)
    expect(result.totalCPUTime).toBe(mockResult.totalCPUTime)
  })

  it('should calculate CPU time on a domain basis', () => {
    // console.log(result)
    expect(result.cpuTimePerDomain['cdn.taboola.com']).toBeDefined()
    expect(result.cpuTimePerDomain['cdn.taboola.com']).toBe(mockResult.cpuTimePerDomain['cdn.taboola.com'])
  })

  it('VA-article.json analysis should exactly match the saved results', () => {
    //console.log(result)
    expect(result).toEqual(mockResult)
  })

})
