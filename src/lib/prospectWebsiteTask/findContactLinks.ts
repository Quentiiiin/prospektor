import { link } from "fs";
import { ElementHandle, Page } from "puppeteer";


export async function findContactLinks(page : Page): Promise < ElementHandle<Element>[] | null > {
    const contactLinks:ElementHandle<Element>[] = [];
    try {
        await page.waitForSelector('a'); // Wait for any links to appear
        const links = await page.$$('a'); // Get all links on the page
        for (let i = 0;i < links.length; i++) {
            const link = links[i];
            const linkHref = await link.evaluate(el => el.getAttribute('href'));
            if (linkHref) {
                const l = linkHref.toLowerCase();
                if(l.includes('impressum') || l.includes('kontakt') || l.includes('contact')){
                    contactLinks.push(link);
                }
            }
        }
        if(links.length > 0){
            return contactLinks;
        }
        return null; // Return null if no link with "Impressum" text is found
    } catch (error) {
        console.error(error);
        return null;
    }
}
