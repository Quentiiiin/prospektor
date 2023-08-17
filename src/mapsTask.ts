import {Browser} from "puppeteer";
import {ProspectInfo} from "./lib/types.js";
import registerRequestIntercepter from "./lib/trafficInterception.js";
import {createUrl} from "./lib/helper.js";
import config from "./config.js";
import rejectCookies from "./lib/mapsTask/rejectCookies.js";
import scrollResultList from "./lib/mapsTask/scrollResultList.js";
import getResultHandles from "./lib/mapsTask/getResultHandles.js";
import scrapeResults from "./lib/mapsTask/scrapeResults.js";
import addLog from "./lib/logger.js";

async function runMapTask(browser: Browser, searchTerm: string): Promise<ProspectInfo[]> {
    addLog(`map task: ${searchTerm} - running`);
    const page = await browser.newPage();

    await registerRequestIntercepter(page);

    await page.goto(createUrl(searchTerm));
    await page.setViewport({width: config.settings.viewport.width, height: config.settings.viewport.height});

    await rejectCookies(page);

    const resultList = await scrollResultList(page);
    const resultHandles = await getResultHandles(resultList);
    const prospects = await scrapeResults(page, resultHandles);

    await page.close();
    addLog(`map task: ${searchTerm} - done`);
    return prospects;
}

export default runMapTask;