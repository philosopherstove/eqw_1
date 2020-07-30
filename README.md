Completed Tasks:

- graphs for different metrics comparing the four Points of Interest (POI).

- table of daily data. Fuzzy search by date or POI.

- map for different POI, with ability to rank intensity of the POI according to different metrics.

- rate limiting on all API endpoints



Rate Limiting Techniques:

The rate limiter uses individual throttling and a token purse to manage server response rates.

Because routes diff as far as what is requested at them, the rate limiter had to have enough flexibility for a programmer to change a few parameters to scale the rate limiter's response as appropriate for the route.





Next Adds:

- designed UI

- graph page include percentage pie charts comparing revenue between the four POI.

- sharpen the intensity-indicator feature. Currently, the feature simply ranks the four POI high-to-low by changing the color of the markers to one of four colors, specified by a legend. Instead, should have the color of the markers related to a met range for amount.

Put another way, currently, I would need as many colors as I have POI. This problem is due to using an individual ranking system. Instead, should have colors according to different ranges; so can constrain the amount of colors needed for use.

- table get fancier sort options

- consolidate naming conventions for server side functions

- code that parses data on the front end into different buckets of data could be written in a more consistent format
