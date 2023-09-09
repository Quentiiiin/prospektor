import { ElementHandle } from 'puppeteer';
import { Config } from '../../config.js';
import { isEven } from '../helper.js';
import addLog from '../logger.js';

/**
 *
 * @param resultList the result list handle recieved from scrollResultList()
 * @returns the filtered array of handles to results
 */
async function getResultHandles(
  resultList: ElementHandle<Element>,
  config: Config,
): Promise<ElementHandle<Element>[]> {
  const resultListSelector = `*[aria-label^="${config.text.resultPanelTitle}"]`;
  // remove junk from entry list
  const allChildElements = await resultList.$$(resultListSelector + ' > *');
  let i = 0;
  const realResults: any = [];
  allChildElements.forEach(async (el: any) => {
    // remove the first two and the last element, as well as every other element because they are junk
    if (!(i < 2 || !isEven(i) || i == allChildElements.length - 1)) {
      realResults.push(el);
    }
    i++;
  });
  return realResults;
}

export default getResultHandles;
