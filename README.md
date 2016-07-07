Why
====

Lot of sites are bloated with ads and other 3rd parties, all of them trying to abuse the CPU, leading the user to leave because the page is so laggy. JS Profiling is often the key to start a negociation with your 3rd party (or remove them…) but takes time. This project will help you identify quickly wich domain name eats most of the CPU.

Install
===

``npm install 3rd-party-cpu-abuser``

Tested on Node > 5.7.x

Steps
===

1. From the Chrome dev tools "Timeline" tab, start a profiling session, desktop or mobile
2. End, then "Save Timeline Data", to have the JSON export
3. provide ``index.js`` with the path to the file
4. run ``npm start``
5. Read the output

Output (from an android tablet on a newspaper website with lots of 3rd party) :

```
Analyzing TimelineRawData-20160616T142901.json
Total CPU busy time : 26026.48
Number of big offenders (> 100ms) :  30
## Top CPU abusers, per hostname :
6559.08 (no-domain)
3990.98 statics.mydomain.com
2220.93 cdn.adnxs.com
1810.60 cdn.taboola.com
1193.47 animate.adobe.com
1128.16 secure-ds.serving-sys.com
800.03 connect.facebook.net
797.66 cdn.teads.tv
673.33 s0.2mdn.net
630.80 srv.azureedge.net
535.71 www.mydomain.com
533.92 www6.smartadserver.com
533.27 cdnjs.cloudflare.com
473.87 render.helios.ligatus.com
398.39 www.google-analytics.com
```


How to read it :
"Total CPU busy time" is everything the profiler recorded

"big offenders" is the number of domain whose total dedicated CPU time exceeded 100 ms

time => domain : time is in milliseconds, domain is where the JS is hosted. The profiler counts the time spent in each function, and by getting down to the callstack, it knows in which file, on which domain it was defined. We add up everything and it gives you a good idea of which 3rd party let your page lag

(no-domain) is what is not tied to someone in particular :
* browser (parse CSS and HTML, layout and composite, the profiler itself)
* JS VM (V8.compile, minor and major Garbage Collector, RegExp engine …)
* plugins, if you forgot to run profiler in private mode
* ``eval()`` … more and more 3rd party use it so certainly some of them are not identified in the listing above

How
===

It uses [Paul Irish's devtools-timeline-model](https://github.com/paulirish/devtools-timeline-model) that extracts meaningful data from a raw Timeline Data JSON file.
It just compute stats for each domain


Future
===

* manage CLI argument (file to parse, time limit)
* better display (table)
* display the timeline total time, to compare to the CPU total time
* add score for each domain :
** is CPU consumed before / after DOM ready, before / after onload
** how many times the CPU runs at 100% for more than 150 ms (so, blocks the UI)
** how many forced reflows ([like here](https://github.com/paulirish/automated-chrome-profiling/blob/master/test-for-layout-thrashing.js))
* compare 2 different runs side by side
* add Alias for domains (eg : cdn.adnxs.com is appNexus, 2mdn.net is Doubleclick)
