# hey, i guess 👋
this is a simple google maps scraper i built for my friend to retrieve prospects to a given niche and location.
it works by opening google maps with pupetteer and searching for a search string (eg. 'mechanics in new york').
it then opens each result and saves the information of it.
additionally if a website url is present we will visit it to find a url for an imprint to scrape possible names or email adresses.

## Usage:
- change the search term in `src/index` on line 29
- update the config in `src/config` to match the aria labels of your language
- `npm run dev`
- wait a few minutes, the result will be saved to a csv file
