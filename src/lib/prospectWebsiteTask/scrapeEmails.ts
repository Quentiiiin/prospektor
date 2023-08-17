import {Page} from "puppeteer";
import getIframeContent from "./getIframeContent.js";

export async function scrapeEmails(page : Page): Promise < string[] > {
    const mainContent = await page.content();
    const iframeContent = await getIframeContent(page);

    let emails: string[] = findEmails(mainContent);
    if (iframeContent) {
        iframeContent.forEach((ifc) => {
            const iMails = findEmails(ifc);
            emails = emails.concat(iMails);
        });
    }
    return emails;
}

const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

function findEmails(html : string): string[] {
    const emails = html.match(emailPattern);
    if(emails){
        return emails;
    }
    return [];
}
