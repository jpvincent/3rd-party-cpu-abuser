'use strict'

const fs = require('fs')
const url = require('url')
const path = require('path')
const Table = require('cli-table')

// ARGUMENTS
const options = require('nopt')(
  {file:path, 'min-time':Number}, // type check
  {f:['--file'], t:['--min-time']} // shorthand
)

// if -f option is not given, take the first argument we have
const filename = options.files || options.argv.remain[0]
try {
  fs.accessSync(filename, fs.constants.R_OK);
}catch(e){
  throw "Please provide a .json file to analyze"
}
// in ms : under this limit, we ignore the domain
const ignoreTime = Number(options.minTime) || 150


// GET DATA
// uses https://github.com/paulirish/devtools-timeline-model
const TraceToTimelineModel = require('devtools-timeline-model')
console.log('Analyzing', filename)
const model = new TraceToTimelineModel(fs.readFileSync(filename, 'utf8'))

// get all CPU time, already grouped by FQDN
const topCosts = [...model.bottomUpGroupBy('Subdomain').children.values()]
const completeTime = topCosts.reduce((total, node) => total + node.totalTime, 0)

// ignore if < 150 ms, sort by time
const filteredTopCosts = topCosts
  // rename the unassigned
  .map((node) => {
    node.id = node.id || '(no-domain)'
    return node
  })
  // ignore small contributions
  .filter((node) => node.totalTime > ignoreTime)
  //.sort((b, a) => a.time - b.time)


// DISPLAY
const tableStats = new Table()
tableStats.push(
  {'Total CPU busy time': completeTime.toFixed(2) },
  {'Total number of domains': topCosts.length },
  {'Number of big offenders': filteredTopCosts.length}
)
console.log(tableStats.toString());

const tableData = new Table({
    head: ['CPU Time', 'domain name'],
//  , colWidths: [100, 200]
})

filteredTopCosts.forEach((node) => tableData.push( [node.totalTime.toFixed(2), node.id]))
console.log(tableData.toString());
