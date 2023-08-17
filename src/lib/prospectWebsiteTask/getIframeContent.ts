import {Page} from 'puppeteer';

async function getIframeContent(page : Page): Promise < string[] > {
    const iframeHandles = page.frames();

    const iframeContentPromises = iframeHandles.map(async (iframe) => {
        const iframeContent = await iframe.content();
        return iframeContent;
    });

    const iframeContentArray = await Promise.all(iframeContentPromises);

    return iframeContentArray;
}

export default getIframeContent;