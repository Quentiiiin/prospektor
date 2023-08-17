import { Page } from "puppeteer";
import config from "../../config.js";

async function rejectCookies(page : Page) {
  if( (await page.title()).includes(config.text.cookiePageTitle)){
    const rejectButton = await page.$(`[aria-label="${config.text.rejectCookiesButton}"]`);
    if(rejectButton != null){
      await rejectButton.click();
    }
  }
}

export default rejectCookies;