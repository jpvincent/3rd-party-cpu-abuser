Why
====

Lot of sites are bloated with ads and other 3rd parties, all of them trying to abuse the CPU, leading the user to leave because the page is so laggy. JS Profiling is often the key to start a negotiation with your 3rd party (or remove them…) but takes time. This project will help you identify quickly wich domain name eats most of the CPU.

# Install

``npm install 3rd-party-cpu-abuser``

Working from Node 6.3.0

# Usage from CLI

1. From the Chrome dev tools "Performance" tab, record a profiling session, desktop or mobile
2. End, then "Save Profile", to have the JSON export
3. run ``node cli.js path/to/the.json``
4. Read the output

Output (from an android tablet on a newspaper website with lots of 3rd parties) :

```
Analyzing samples/VA-article.json
┌──────────────────────────┬──────────┐
│ Total CPU busy time (ms) │ 10107.07 │
├──────────────────────────┼──────────┤
│ Total number of domains  │ 57       │
├──────────────────────────┼──────────┤
│ Number of big offenders  │ 40       │
└──────────────────────────┴──────────┘
┌───────────────┬────────────────────────────────┐
│ CPU Time (ms) │ domain name                    │
├───────────────┼────────────────────────────────┤
│ 1311.39       │ www.vogue.fr                   │
├───────────────┼────────────────────────────────┤
│ 865.91        │ z.moatads.com                  │
├───────────────┼────────────────────────────────┤
│ 835.78        │ pagead2.googlesyndication.com  │
├───────────────┼────────────────────────────────┤
│ 788.86        │ securepubads.g.doubleclick.net │
├───────────────┼────────────────────────────────┤
│ ………………        │ ……………………………………………………           │
├───────────────┼────────────────────────────────┤
│ 565.78        │ data05.adlooxtracking.com      │
├───────────────┼────────────────────────────────┤
│ 559.52        │ tpc.googlesyndication.com      │
└───────────────┴────────────────────────────────┘

```


How to read it :
"Total CPU busy time" is everything the profiler recorded

"big offenders" is the number of domain whose total dedicated CPU time exceeded 150 ms (you can change this parameter with a ``-t`` flag)

time => domain : time is in milliseconds, domain is where the JS is hosted. The profiler counts the time spent in each function, and by getting down to the callstack, it knows in which file, on which domain it was defined. We add up everything and it gives you a good idea of which 3rd party let your page lag


## JSON export

Alternatively you can access the same data as JSON :
`node cli.js path/to/the.json --json`

Or you can write your own nodeJS module and use it :

```javascript
const statsPerDomain = require('3rd-party-cpu-abuser')
console.log(
  statsPerDomain.data({
    file: 'path/to/the.json'
  })
)
```

## Start and End Times

By default, all script execution in the whole trace is counted but if you want to count just the execution time  before or after a named event then `-s` (`--startMark`) and `-e` (`--endMark`) do this.

For example

`node cli.js path/to/the.json -s firstMeaningfulPaint`

or

`node cli.js path/to/the.json -e loadEventEnd`

or 

`node cli.js path/to/the.json -s loadEventStart -e loadEventEnd`

Some example event that may be in a trace include:
- domLoading
- firstLayout
- firstPaint
- firstContentfulPaint
- firstTextPaint
- firstImagePaint
- firstMeaningfulPaintCandidate
- firstMeaningfulPaint
- domInteractive
- domContentLoadedEventStart
- domContentLoadedEventEnd
- domComplete
- loadEventStart
- loadEventEnd

The timestamp used to subset the trace is the timestamp of the event on the root frame (normally the page that's loaded). If the event doesn't exist an error will be thrown, if there's more than on the first will be used.

## Grouping

By default, CPU time is grouped by Subdomain but it can be grouped by `None`, `Category`, `Subdomain`, `Domain`, `URL` or `EventName` (categories used in Chrome's performance tab) using the `g` (`--groupBy`) flag

For example

`node cli.js path/to/the.json -g URL`




# How

It uses [Paul Irish's devtools-timeline-model](https://github.com/paulirish/devtools-timeline-model) that extracts meaningful data from a raw Timeline Data JSON file.
It just compute stats for each domain and display it nicely.


# Future

If you want to help me with those, you're welcome :
* add Alias for domains (eg : cdn.adnxs.com is appNexus, 2mdn.net is Doubleclick…)
* add score for each domain :
  * is CPU consumed before / after DOM ready, before / after onload
  * how many times the CPU runs at 100% for more than 150 ms (so, blocks the UI)
  * how many forced reflows ([like here](https://github.com/paulirish/automated-chrome-profiling/blob/master/test-for-layout-thrashing.js))
* compare 2 different runs side by side
* add tests
