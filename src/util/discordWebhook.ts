import {RESTPostAPIChannelMessageJSONBody} from 'discord-api-types/v10';

export async function sendDiscordWebhook(
  hook: string,
  body: RESTPostAPIChannelMessageJSONBody
) {
  const resp = await fetch(`${hook}?wait=1`, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(r => r.json());

  console.log(resp);
}
