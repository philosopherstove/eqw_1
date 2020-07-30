Completed Tasks:

- graphs for different metrics comparing the four Points of Interest (POI).

- table of daily data. Fuzzy search by date or POI.

- map for different POI, with ability to rank intensity of the POI according to different metrics.

- rate limiting on all API endpoints



Rate Limiting Techniques:

The rate limiter uses individual throttling and a token purse to manage server response rates.

Because routes diff as far as what is requested at them, the rate limiter had to have enough flexibility for a programmer to change a few parameters to scale the rate limiter's response as appropriate for the route.





Next Adds:

Graph Page:
- include percentage pie-charts comparing revenue between the four POI.

Map Page:
- sharpen the intensity-indicator feature. Currently, the feature simply ranks the four POI high-to-low, giving each marker a different color. This means that I would need as many colors as I have POI. Instead, should have colors related to different ranges; so can constrain the amount of colors needed for use.

Table Page:
- fancier sort options for the table

General:
- designed UI
- consolidate naming conventions for server side functions
- the code that parses data on the front end into different buckets of data could be written in a more consistent format
