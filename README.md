Why
====

Lot of sites are bloated with ads and other 3rd parties, all of them trying to abuse the CPU, leading the user to leave because the page is so laggy. JS Profiling is often the key to start a negociation with your 3rd party (or remove them…) but takes time. This project will help you identify quickly wich domain name eats most of the CPU.

Install
===

``npm install 3rd-party-cpu-abuser``

Working from Node 6.3.0

Usage
===

1. From the Chrome dev tools "Timeline" tab, start a profiling session, desktop or mobile
2. End, then "Save Timeline Data", to have the JSON export
3. run ``node cpu-abuser.js path/to/the.json``
4. Read the output

Output (from an android tablet on a newspaper website with lots of 3rd party) :

```
Analyzing TimelineRawData-20160616T142901.json
┌─────────────────────────┬──────────┐
│ Total CPU busy time     │ 22277.24 │
├─────────────────────────┼──────────┤
│ Total number of domains │ 46       │
├─────────────────────────┼──────────┤
│ Number of big offenders │ 19       │
└─────────────────────────┴──────────┘
┌──────────┬───────────────────────────────┐
│ CPU Time │ domain name                   │
├──────────┼───────────────────────────────┤
│ 2826.57  │ cdn.adnxs.com                 │
├──────────┼───────────────────────────────┤
│ 2160.30  │ static.mysite.fr              │
├──────────┼───────────────────────────────┤
│ 2083.50  │ www.facebook.com              │
├──────────┼───────────────────────────────┤
│ 9671.66  │ (no-domain)                   │
├──────────┼───────────────────────────────┤
│ 746.00   │ connect.facebook.net          │
├──────────┼───────────────────────────────┤
│ 638.47   │ srv.azureedge.net             │
├──────────┼───────────────────────────────┤
│ 512.04   │ www.mysite.fr                 │
├──────────┼───────────────────────────────┤
│ 500.50   │ ajax.googleapis.com           │
├──────────┼───────────────────────────────┤
│ 328.81   │ www6.smartadserver.com        │
└──────────┴───────────────────────────────┘

```


How to read it :
"Total CPU busy time" is everything the profiler recorded

"big offenders" is the number of domain whose total dedicated CPU time exceeded 150 ms (you can change this parameter with a ``-t`` flag)

time => domain : time is in milliseconds, domain is where the JS is hosted. The profiler counts the time spent in each function, and by getting down to the callstack, it knows in which file, on which domain it was defined. We add up everything and it gives you a good idea of which 3rd party let your page lag

(no-domain) is what is not tied to someone in particular :
* browser (parse CSS and HTML, layout and composite, the profiler itself)
* JS VM (V8.compile, minor and major Garbage Collector, RegExp engine …)
* plugins, if you forgot to run profiler in private mode
* ``eval()`` … more and more 3rd party use it so certainly some of them are not identified in the listing above

How
===

It uses [Paul Irish's devtools-timeline-model](https://github.com/paulirish/devtools-timeline-model) that extracts meaningful data from a raw Timeline Data JSON file.
It just compute stats for each domain and display it nicely.


Future
===

If you want to help me with those, you're welcome :
* add Alias for domains (eg : cdn.adnxs.com is appNexus, 2mdn.net is Doubleclick…)
* output as JSON
* add score for each domain :
  * is CPU consumed before / after DOM ready, before / after onload
  * how many times the CPU runs at 100% for more than 150 ms (so, blocks the UI)
  * how many forced reflows ([like here](https://github.com/paulirish/automated-chrome-profiling/blob/master/test-for-layout-thrashing.js))
* compare 2 different runs side by side
