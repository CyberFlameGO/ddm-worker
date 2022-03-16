import {EmitterWebhookEvent, EmitterWebhookEventName} from '@octokit/webhooks';
import type {APIEmbed} from 'discord-api-types/v10';

export const buildEmbeds = <T extends EmitterWebhookEventName>(
  event: EmitterWebhookEvent<T>
): APIEmbed[] => {
  const embeds: APIEmbed[] = [];

  switch (event.name) {
    case 'commit_comment': {
      const bodyChunks = chunkString(event.payload.comment.body, 2048);

      for (const chunk of bodyChunks) {
        const embed: APIEmbed = {
          description: chunk,
        };

        embeds.push(embed);
      }

      break;
    }
  }

  return embeds;
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
