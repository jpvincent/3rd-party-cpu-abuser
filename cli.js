
const cliOptions = require('nopt')(
  { // type check
    file: require('path'),
    'min-time': Number,
    output: String },
  { // shorthand
    f: ['--file'],
    t: ['--min-time'],
    o: ['--output']
  }
)

// if -f (file) option is not given, assume the first CLI argument is the file path
const options = {
  file: cliOptions.file || cliOptions.argv.remain[0],
  minTime: cliOptions.minTime
}
const statsPerDomain = require('./index')

if( cliOptions.output === 'json') {
  console.log(statsPerDomain.data(options))
} else {
  console.log('Analyzing', options.file)
  console.log(statsPerDomain.toTableConsole(options))
}
