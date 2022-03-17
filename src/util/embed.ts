import {EmitterWebhookEvent, EmitterWebhookEventName} from '@octokit/webhooks';
import type {APIEmbed} from 'discord-api-types/v10';

import {getImagesFromMarkdown} from '../util/parser';

export const buildEmbeds = <T extends EmitterWebhookEventName>(
  event: EmitterWebhookEvent<T>
): APIEmbed[] => {
  switch (event.name) {
    case 'commit_comment': {
      const {comment, repository, sender} = event.payload;

      const bodyChunks = chunkString(
        comment.body.replace(/\\r\\n/g, '\n').trim(),
        2048
      );

      const build = (chunk: string): APIEmbed => ({
        description: chunk,
      });

      const buildImageEmbed = (img: string): APIEmbed => ({
        image: {
          url: img,
        },
      });

      const embeds = bodyChunks.map((chunk, i) => {
        const embed = build(chunk);

        if (i === 0) {
          embed.title = `[${repository.name}:${
            repository.default_branch
          }] New comment on commit \`${comment.commit_id.substring(0, 6)}\``;
          embed.url = comment.html_url;
          embed.author = {
            icon_url: sender.avatar_url,
            name: sender.name || sender.login,
            url: sender.url,
          };
        }
        return embed;
      });

      const imgs = getImagesFromMarkdown(comment.body);
      const imgEmbeds = imgs.map(buildImageEmbed);

      return embeds.concat(imgEmbeds);
    }
  }

  return [];
};

// TODO: somehow make ``` not get broken/split between multiple embeds
const chunkString = (text: string, len: number): string[] => {
  let curr = len;
  let prev = 0;

  const output = [];

  while (text[curr]) {
    if (text[curr++] === ' ') {
      output.push(text.substring(prev, curr));
      prev = curr;
      curr += len;
    }
  }

  output.push(text.substring(prev));
  return output;
};
