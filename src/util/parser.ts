import {GfmExParser} from '@yozora/parser-gfm-ex';
import {parse as parseHTML} from 'node-html-parser';

export const getImagesFromMarkdown = (md: string): string[] => {
  let imgs: string[] = [];

  const mdParser = new GfmExParser();

  // @ts-expect-error for some reason the library types are messed up so this doesn't work properly
  const walk = node => {
    for (const child of node.children) {
      if (child.children) {
        walk(child);
      } else {
        switch (child.type) {
          case 'image': {
            imgs.push(child.url);
            break;
          }
          case 'html': {
            const parsedHTML = parseHTML(child.value);
            const imgUrls = parsedHTML
              .querySelectorAll('img')
              .map(i => i.getAttribute('src'))
              .filter(Boolean);

            imgs = imgs.concat(imgUrls as string[]);
            break;
          }
        }
      }
    }

    return;
  };

  const parsed = mdParser.parse(md);
  walk(parsed);
  return Array.from(new Set(imgs));
};
