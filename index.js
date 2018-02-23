const fs = require('fs')
const path = require('path')
const Table = require('cli-table')

// full external API
exports.toTableConsole = options => toTableConsole(main(options))
exports.data = main

// actual code
// supported options :
// file: (String) Path to a file
// minTime: (Number) under this limit, the domain is ignored. Set to 0 to have them all
function main(options) {
  try {
    fs.accessSync(options.file, fs.constants.R_OK)
  } catch (e) {
    throw 'Please provide a .json file to analyze'
  }
  // in ms : under this limit, we ignore the domain
  if('minTime' in options && !Number.isNaN(Number(options.minTime)))
    var ignoreTime = Number(options.minTime)
  else
    var ignoreTime = 150

  const groupBy = options.groupBy || 'Subdomain'
  const startMark = options.startMark || null
  const endMark = options.endMark || null

  // GET DATA
  // uses https://github.com/paulirish/devtools-timeline-model
  const TraceToTimelineModel = require('devtools-timeline-model')
  const model = new TraceToTimelineModel(fs.readFileSync(options.file, 'utf8'))

  // Allow processing to be restricted by start/endMarks e.g. firstPaint
  let startTimeStamp = 0
  let endTimeStamp = Infinity

  if(startMark != null) { // TODO(AD) should warn if mark doesn't exist

    let records = model.sandbox._timelineModel._eventDividerRecords.filter(o => o._event.name === startMark)
    if (records.length > 0) {
        startTimeStamp = records[0]._event.startTime; // TODO(AD) what if there's more that one?
    }
  }

  if(endMark != null) {

    let records = model.sandbox._timelineModel._eventDividerRecords.filter(o => o._event.name == endMark)
    if (records.length > 0) {
        endTimeStamp = records[0]._event.startTime;
    }
  }


  // get all CPU time, already grouped by FQDN
  const topCosts = [...model.bottomUpGroupBy(groupBy, startTimeStamp, endTimeStamp).children.values()]
  const completeTime = topCosts.reduce((total, node) => total + node.totalTime, 0)

  // @TODO : test forced relayouts
  // https://github.com/paulirish/automated-chrome-profiling/blob/master/test-for-layout-thrashing.js
  /* console.log(model.frameModel())
  const forcedReflowEvents = model.frameModel().frames()
    .filter( e => e.name == 'UpdateLayoutTree' || e.name == 'Layout')
    .filter( e => e.args && e.args.beginData && e.args.beginData.stackTrace && e.args.beginData.stackTrace.length)
  console.log('forcedReflowEvents', forcedReflowEvents)
  */

  // ignore if < 150 ms, sort by time
  const filteredTopCosts = topCosts
    // rename the unassigned
    .map((node) => {
      node.id = node.id || '(no-domain)'
      return node
    })
    // ignore small contributions
    .filter((node) => node.totalTime > ignoreTime)
    // .sort((b, a) => a.time - b.time)

  const data = {
    // First, some stats
    totalCPUTime: completeTime,
    totalDomains: topCosts.length,
    totalOffendersDomains: filteredTopCosts.length,
    // then the filtered data
    cpuTimePerDomain:{}
  }
  // associate a domain to a time
  filteredTopCosts.forEach((node) => 
    data.cpuTimePerDomain[node.id] = node.totalTime
  )

  return data
}

function toTableConsole(data) {
  const tableSummary = new Table()
  let output = ''


  tableSummary.push(
    { 'Total CPU busy time (ms)': data.totalCPUTime.toFixed(2) },
    { 'Total number of domains': data.totalDomains },
    { 'Number of big offenders': data.totalOffendersDomains }
  )
  output += tableSummary.toString()
  output += '\n'

  const tableData = new Table({
    head: ['CPU Time (ms)', 'domain name']
  })

  for(domainName in data.cpuTimePerDomain) {
    tableData.push([data.cpuTimePerDomain[domainName].toFixed(2), domainName])
  }

  output += tableData.toString()
  return output
}
