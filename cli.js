
const cliOptions = require('nopt')(
  { // type check
    file: require('path'),
    'min-time': Number,
    groupBy: ['None', 'Category', 'Subdomain', 'Domain', 'URL', 'EventName'],
    startMark: String,
    endMark: String,
    output: String },
  { // shorthand
    f: ['--file'],
    t: ['--min-time'],
    g: ['--groupBy'],
    s: ['--startMark'],
    e: ['--endMark'],
    o: ['--output'],
    json: ['--output=json']
  }
)


// if -f (file) option is not given, assume the first CLI argument is the file path
const options = {
  file: cliOptions.file || cliOptions.argv.remain[0],
  minTime: cliOptions['min-time'],    
  groupBy: cliOptions.groupBy,
  startMark: cliOptions.startMark,
  endMark: cliOptions.endMark
}

const statsPerDomain = require('./index')

if( cliOptions.output === 'json') {
  console.log(statsPerDomain.data(options))
} else {
  console.log('Analyzing', options.file)
  console.log(statsPerDomain.toTableConsole(options))
}
