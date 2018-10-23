const cpuAbuser = require('../index')
const mockPath = '__tests__/__mocks__/trace-vanity-mobile.json'
const mockResult = require('./__mocks__/output-vanity-mobile.json')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

describe('Common behaviour', () => {
  it('should throw an error if file does not exist', () => {
    expect(() => cpuAbuser.data({
      file: 'non-existent'
    })).toThrow()
  })
})


let resultDefault

describe('Node API with JSON results : default options', () => {
  let result = cpuAbuser.data({
    file: mockPath
  })
  resultDefault = result // for next test to compare

  it('should have a JSON structure', () => {
    //console.log(result)
    expect( result.totalCPUTime ).toBeDefined()
    expect( result.cpuTimePerDomain ).toBeDefined()
  })

  it('timings should be Number', () => {
    //console.log(result)
    expect(result.totalCPUTime).toEqual(expect.any(Number))
    expect(result.cpuTimePerDomain['pagead2.googlesyndication.com']).toEqual(expect.any(Number))
  })

  it('should calculate totalCPUTime', () => {
    // console.log(result)
    expect(result.totalCPUTime).toBe(mockResult.totalCPUTime)
  })

  it('should calculate CPU time on a domain basis', () => {
    // console.log(result)
    expect(result.cpuTimePerDomain['pagead2.googlesyndication.com']).toBeDefined()
    expect(result.cpuTimePerDomain['pagead2.googlesyndication.com']).toBe(mockResult.cpuTimePerDomain['pagead2.googlesyndication.com'])
  })

  it('trace-vanity-mobile.json analysis should exactly match the saved results', () => {
    //console.log(result)
    expect(result).toEqual(mockResult)
    expect(result).toMatchSnapshot()
  })

})

describe('results as console table : default options', () => {
  let result = cpuAbuser.toTableConsole({
    file: mockPath
  })

  it('should match the previous mock', () => {
    expect(result).toMatchSnapshot()
  })

})

describe('Node API with JSON results : minTime=10', () => {
  let result = cpuAbuser.data({
    file: mockPath,
    minTime: 10
  })

  it('Changing minTime should return more results', () => {
    expect(result.totalOffendersDomains).toBeGreaterThan(resultDefault.totalOffendersDomains)
  })

})

describe('Node API with JSON results : minTime=0', () => {
  let result = cpuAbuser.data({
    file: mockPath,
    minTime: 0
  })

  it('Changing minTime should return more results', () => {
    expect(result.totalOffendersDomains).toBeGreaterThan(resultDefault.totalOffendersDomains)
  })

})

describe.only('Node API : groupBy=URL', () => {
  let result = cpuAbuser.data({
    file: mockPath,
    groupBy: 'URL'
  })

  it('should calculate CPU time on a per URL basis', () => {
    // console.log(result)
    expect(result.cpuTimePerDomain['https://pagead2.googlesyndication.com/pagead/osd.js']).toBeDefined()
//    expect(result.cpuTimePerDomain['https://pagead2.googlesyndication.com/pagead/osd.js']).toBe(169.76800015568733)
  })

  it('should calculate totalCPUTime', () => {
    // console.log(result)
    expect(result.totalCPUTime).toBe(mockResult.totalCPUTime)
  })

  /*it('Changing minTime should return more results', () => {
    expect(result.totalOffendersDomains).toBeGreaterThan(resultDefault.totalOffendersDomains)
  })*/

})
