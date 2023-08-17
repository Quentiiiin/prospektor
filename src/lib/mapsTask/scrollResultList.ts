import {JSHandle, Page} from "puppeteer";
import config from "../../config.js";
import {queryByText, scrollDown} from "../helper.js";
import addLog from "../logger.js";


/**
 * scrolls the result list of google maps down until the end
 * @param page the page on of the result list
 * @returns the handle of the list
 */
async function scrollResultList(page: Page) {
    addLog(`scrolling result list - running`);
    const resultListSelector = `*[aria-label^="${
        config.text.resultPanelTitle
    }"]`;
    const resultList = await page.waitForSelector(resultListSelector);

    // scroll down the result list
    let hasReachedEnd = true; // <-- if set to true doesnt scroll down, useful for testing

    while (! hasReachedEnd) {
        scrollDown(page, resultList, 2000);
        if (await queryByText(page, resultList, config.text.resultPanelEndReached)) {
            hasReachedEnd = true;
        }
    }
    addLog(`scrolling result list - done`);
    return resultList;
}

export default scrollResultList;