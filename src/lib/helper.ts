import { ElementHandle, Page } from 'puppeteer';

export async function scrollDown(
  page: Page,
  element: ElementHandle<Element>,
  amount: number,
) {
  await page.evaluate(
    (element: any, amount: number) => {
      element.scrollBy(0, amount);
    },
    element,
    amount,
  );
}

export async function queryByText(
  page: Page,
  parent: ElementHandle<Element>,
  text: string,
) {
  for (const element of await parent.$$('*')) {
    if ((await getTextContent(page, element)).includes(text)) {
      return element;
    }
  }
}

export async function getTextContent(
  page: Page,
  element: ElementHandle<Element>,
) {
  return await page.evaluate((element) => {
    return element.textContent;
  }, element);
}

export function isEven(number: number) {
  return number % 2 === 0;
}

export function createUrl(searchTerm: string) {
  return `https://www.google.com/maps/search/${searchTerm.replace(' ', '+')}?hl=en`;
}

export async function click(page: Page, handle: ElementHandle<any>) {
  await page.evaluate((el) => el.click(), handle);
}

export async function getPropValue(
  page: Page,
  handle: ElementHandle<Element>,
  name: string,
) {
  if (handle) {
    return await page.evaluate(
      (el, name) => el.getAttribute(name),
      handle,
      name,
    );
  } else return '';
}

export function mostCommonString(strings: string[]): string | undefined {
  const frequencyMap: { [key: string]: number } = {};

  for (const str of strings) {
    if (frequencyMap[str]) {
      frequencyMap[str]++;
    } else {
      frequencyMap[str] = 1;
    }
  }

  let mostCommon: string | undefined;
  let maxFrequency = 0;

  for (const key in frequencyMap) {
    if (frequencyMap[key] > maxFrequency) {
      mostCommon = key;
      maxFrequency = frequencyMap[key];
    }
  }

  return mostCommon;
}

export function removeDuplicates(arr: string[]): string[] {
  // Use a Set to store unique elements
  const uniqueSet = new Set(arr);

  // Convert the Set back to an array
  const uniqueArray = Array.from(uniqueSet);

  return uniqueArray;
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
