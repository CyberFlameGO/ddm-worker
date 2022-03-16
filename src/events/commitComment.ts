import {HandlerFunction} from '@octokit/webhooks/dist-types/types';
import {sendDiscordWebhook} from '../util/discordWebhook';
import {buildEmbeds} from '../util/embed';

declare const DEV_HOOK: string;

export const commitComment: HandlerFunction<
  'commit_comment',
  unknown
> = async event => {
  const embeds = buildEmbeds<'commit_comment'>(event);
  await sendDiscordWebhook(DEV_HOOK, {embeds});
};
