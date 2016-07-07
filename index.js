'use strict'

const filename = 'samples/HP-prod.json'
const ignoreTime = 150 // in ms : under this limit, we ignore the domain

const fs = require('fs')
const url = require('url')

// uses https://github.com/paulirish/devtools-timeline-model
const TraceToTimelineModel = require('devtools-timeline-model')
console.log('Analyzing', filename)
const model = new TraceToTimelineModel(fs.readFileSync(filename, 'utf8'))

// get all CPU time, grouped by script URL
const topCosts = [...model.bottomUpGroupBy('Subdomain').children.values()]
const completeTime = topCosts.reduce((total, node) => total + node.totalTime, 0)

// ignore if < 150 ms, sort by time
const filteredTopCosts = topCosts
  // group the unassigned
  .map((node) => {
    if(!node.id)
      console.log(node)
    node.id = node.id || '(no-domain)'
    return node
  })
  // ignore small contributions
  .filter((node) => node.totalTime > ignoreTime)
  //.sort((b, a) => a.time - b.time)

// display
console.log('Total CPU busy time :', completeTime.toFixed(2))
console.log('Total number of domains :', topCosts.length)
console.log(`Number of big offenders (> ${ignoreTime}ms) : `, filteredTopCosts.length)
console.log('## Top CPU abusers, per hostname :')
filteredTopCosts.forEach((node) => console.log(node.totalTime.toFixed(2), node.id))

// console.log(topCosts)