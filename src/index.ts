import {
  EmitterWebhookEvent,
  EmitterWebhookEventName,
  Webhooks,
} from '@octokit/webhooks';

import {commitComment} from './events/commitComment';

declare const NODE_ENV: string;
declare const GITHUB_WEBHOOK_SECRET: string;

const wh = new Webhooks({
  secret: GITHUB_WEBHOOK_SECRET,
});

wh.on('commit_comment', commitComment);

async function handleRequest(req: Request) {
  console.log(req.method, req.url);
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {status: 405});
  }

  if (NODE_ENV === 'development') {
    const body: EmitterWebhookEvent = await req.json();
    await wh.receive(body);
  } else {
    const delivery = req.headers.get('X-GitHub-Delivery')!;
    const event = req.headers.get('X-GitHub-Event')! as EmitterWebhookEventName;
    const body = await req.text();

    if (![delivery, event].every(h => !!h) || !body) {
      return new Response('Bad Request', {status: 400});
    }

    await wh
      .verifyAndReceive({
        id: delivery,
        name: event,
        payload: body,
        signature: await wh.sign(body),
      })
      .catch(err => {
        console.log('failed to verify webhook:', err);
      });
  }

  return new Response('', {status: 204});
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
