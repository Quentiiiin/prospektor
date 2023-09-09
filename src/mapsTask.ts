import { Browser } from 'puppeteer';
import { ProspectInfo } from './lib/types.js';
import registerRequestIntercepter from './lib/trafficInterception.js';
import { createUrl } from './lib/helper.js';
import { Config } from './config.js';
import rejectCookies from './lib/mapsTask/rejectCookies.js';
import scrollResultList from './lib/mapsTask/scrollResultList.js';
import getResultHandles from './lib/mapsTask/getResultHandles.js';
import scrapeResults from './lib/mapsTask/scrapeResults.js';
import addLog from './lib/logger.js';

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
  const resultHandles = await getResultHandles(resultList, config);
  const prospects = await scrapeResults(page, resultHandles, config);

  await page.close();
  addLog(`map task: ${searchTerm} - done`);
  return prospects;
}

export default runMapTask;
