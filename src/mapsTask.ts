import { Browser } from 'puppeteer';
import { Config } from './config.js';
import { createUrl } from './lib/helper.js';
import addLog from './lib/logger.js';
import getResultHandles from './lib/mapsTask/getResultHandles.js';
import rejectCookies from './lib/mapsTask/rejectCookies.js';
import scrapeResults from './lib/mapsTask/scrapeResults.js';
import scrollResultList from './lib/mapsTask/scrollResultList.js';
import registerRequestIntercepter from './lib/trafficInterception.js';
import { ProspectInfo } from './lib/types.js';
import { removeAds } from './lib/mapsTask/removeAds.js';

async function runMapTask(
  browser: Browser,
  searchTerm: string,
  config: Config,
): Promise<ProspectInfo[]> {
  addLog(`map task: ${searchTerm} - running`);
  const page = await browser.newPage();

  await registerRequestIntercepter(page, config);

  await page.goto(createUrl(searchTerm));
  await page.setViewport({
    width: config.settings.viewport.width,
    height: config.settings.viewport.height,
  });

  await rejectCookies(page, config);

  const resultList = await scrollResultList(page, config);
  const resultHandlesWithAds = await getResultHandles(resultList, config);
  const resultHandles = await removeAds(resultHandlesWithAds, config);
  const prospects = await scrapeResults(page, resultHandles, config);

  await page.close();
  addLog(`map task: ${searchTerm} - done: found ${prospects.length} prospects`);
  return prospects;
}

export default runMapTask;
