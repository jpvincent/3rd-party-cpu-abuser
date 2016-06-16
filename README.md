Why
====

Lot of sites are bloated with ads and other 3rd parties, all of them trying to abuse the CPU, leading the user to leave because the page is so laggy. JS Profiling is often the key to start a negociation with your 3rd party (or remove them…) but takes time. This project will help you identify quickly wich domain name eats most of the CPU.

Install
===
``npm install``

Tested on Node > 5.7.x


How
===

1. run a JS profiling session with chrome, desktop or mobile
2. "Save Timeline Data"
3. provide ``index.js`` with the path to the file
4. run ``npm start``
5. Read the output

Output (from an android tablet on a newspaper website with lots of 3rd party) :

```
Analyzing TimelineRawData-20160616T142901.json
Total CPU busy time : 26026.48
Number of big offenders (> 100ms) :  30
##
6559.08 (no-domain)
3990.98 my.domain.fr
2220.93 cdn.adnxs.com
1810.60 cdn.taboola.com
1193.47 animate.adobe.com
1128.16 secure-ds.serving-sys.com
800.03 connect.facebook.net
797.66 cdn.teads.tv
673.33 s0.2mdn.net
630.80 srv.azureedge.net
535.71 www.lexpress.fr
533.92 www6.smartadserver.com
533.27 cdnjs.cloudflare.com
473.87 render.helios.ligatus.com
398.39 www.google-analytics.com
```


How to read it :
"Total CPU busy time" is everything the profiler recorded

"big offenders" is the number of domain whose total dedicated CPU time exceeded 100 ms

time => domain : time is in milliseconds, domain is where the JS is hosted. The profiler counts the time spent in each function, and by getting down to the callstack, it knows in which file, on which domain it was defined. We add up everything and it gives you a good idea of which 3rd party let your page lag

(no-domain) is everything that could not be determined :
* browser
* plugins
* ``eval()`` … more and more 3rd party use it so certainly some of them are not identified in the listing above
