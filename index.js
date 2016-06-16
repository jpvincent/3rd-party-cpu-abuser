'use strict'

const filename = 'TimelineRawData-20160616T142901.json'
const ignoreTime = 100 // in ms : under this limit, we ignore the domain

const fs = require('fs')
const url = require('url')

// uses https://github.com/paulirish/devtools-timeline-model
const TraceToTimelineModel = require('devtools-timeline-model')
console.log('Analyzing', filename)
const model = new TraceToTimelineModel( fs.readFileSync(filename, 'utf8') )

// get all CPU time, grouped by script URL
var topCosts = [...model.bottomUpGroupBy('URL').children.values()]
const completeTime = topCosts.reduce( (total, node) => total + node.totalTime , 0)

// regroup by hostname
const topCostsByDomain = {}
topCosts.forEach((node) => {
  const domainName = url.parse(node.id).hostname || '(no-domain)'
  topCostsByDomain[domainName] = topCostsByDomain[domainName] || 0
  topCostsByDomain[domainName] += node.totalTime
})
// make an array, for who-needs-lodash manipulations
var domainsCost = []
for( let domainName in topCostsByDomain )
  domainsCost.push({
    domainName: domainName,
    time: topCostsByDomain[domainName]
  })

// ignore if < 100 ms, sort again
domainsCost = domainsCost.filter( (cost) => cost.time > ignoreTime)
domainsCost = domainsCost.sort( (b, a) => a.time - b.time)

// display
console.log('Total CPU busy time :', completeTime.toFixed(2) )
console.log(`Number of big offenders (> ${ignoreTime}ms) : `, domainsCost.length)
console.log('##')
domainsCost.forEach( node => console.log(node.time.toFixed(2), node.domainName))
