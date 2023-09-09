import { ElementHandle, Page } from "puppeteer";
import { Config } from "../../config.js";

export async function removeAds(resultHandles: ElementHandle<Element>[], config: Config): Promise<ElementHandle<Element>[]> {
    const withoutAds: ElementHandle<Element>[] = [];

    for (let f = 0; f < resultHandles.length; f++) {
        const current = resultHandles[f];
        if (!await hasChildWithAriaLabel(current, config.text.advertisingLabel)){
            withoutAds.push(current);
        }

        
    }

    return withoutAds;
}

async function hasChildWithAriaLabel(
    parentElement: ElementHandle<Element>,
    targetAriaLabel: string
  ): Promise<boolean> {
    // Query for all elements inside the parent with the given aria-label
    const matchingElements = await parentElement.$$(`[aria-label="${targetAriaLabel}"]`);
  
    // Check if any matching elements were found
    return matchingElements.length > 0;
  }