import { Page } from 'puppeteer';

export async function findContactLinks(page: Page): Promise<string[] | null> {
  const rawContactLinks: string[] = [];
  try {
    await page.waitForSelector('a'); // Wait for any links to appear
    const links = await page.$$('a'); // Get all links on the page
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const linkHref = await link.evaluate((el) => el.getAttribute('href'));
      if (linkHref) {
        const l = linkHref.toLowerCase();
        if (
          l.includes('impressum') ||
          l.includes('kontakt') ||
          l.includes('contact')
        ) {
          rawContactLinks.push(linkHref);
        }
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
  const absoluteURLs: string[] = rawContactLinks.map((linkHref) =>
    convertToAbsoluteURL(page.url(), linkHref),
  );
  const contactLinks: string[] = removeMailTo(absoluteURLs);
  if (contactLinks.length > 0) {
    return contactLinks;
  }
  return null; // Return null if no link with "Impressum" text is found
}

function convertToAbsoluteURL(
  currentPageURL: string,
  linkHref: string,
): string {
  // Create a URL object for the current page URL
  const currentPage = new URL(currentPageURL);

  // Check if the linkHref is an absolute URL
  const isAbsoluteURL =
    linkHref.startsWith('http://') || linkHref.startsWith('https://');

  if (isAbsoluteURL) {
    // If the linkHref is already an absolute URL, return it as is
    return linkHref;
  } else {
    // If the linkHref is a relative URL, convert it to an absolute URL
    const absoluteURL = new URL(linkHref, currentPage);
    return absoluteURL.href;
  }
}

function removeMailTo(links: string[]): string[] {
  const wordsToRemove = ['mailto:', 'mailot:'];
  return links.filter(
    (item) => !wordsToRemove.some((word) => item.includes(word)),
  );
}
