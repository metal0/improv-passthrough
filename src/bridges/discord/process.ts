import { ImprovEmailWebhook } from '../../improvmx.js';
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from 'node-html-markdown'
import { WebhookCreateMessageOptions } from 'discord.js'
import { BridgePlatform } from '../../platform.js';



function chunkSubstr(str: string, size: number) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size)
  }

  return chunks
}

function payloadBuilder(webhook: ImprovEmailWebhook): WebhookCreateMessageOptions {
  const newRawCopy: ImprovEmailWebhook = JSON.parse(JSON.stringify(webhook));
  newRawCopy.headers = {};
  newRawCopy.text = `<hidden>`;
  newRawCopy.html = ``;
  const rawPayload = JSON.stringify(newRawCopy, null, 0);
  const rawText = `Email payload JSON:\`\`\`json\n${rawPayload}\n\`\`\``
  // const chunked: string[] = chunkSubstr(rawText, 2000);
  const sentTo = webhook.to.map(e => e.name ? `${e.name} <${e.email}>` : e.email);
  const msg: WebhookCreateMessageOptions = {
    username: `✉ ${webhook.envelope.recipient}`,
    avatarURL: 'https://msafe.i0.tf/hHYsf.png',
    tts: false,
    // content: rawText.length < 4000 ? rawText : '',
    embeds: [{
      title: `Subject: ${webhook.subject ?? 'None'}`,
      timestamp: webhook.timestamp ? new Date(webhook.timestamp*1000).toISOString() : undefined,
      author: {
        name: webhook.from.name ? `${webhook.from.name} <${webhook.from.email}>` : webhook.from.email,
        icon_url: 'https://msafe.i0.tf/ALobc.png'
      },
      description: webhook.text,
      footer: {
        text: ` - Sent to ${sentTo.join(', ')}`
      },
    }]
  }
  return msg;
}

new BridgePlatform('discord', async (data) => {
  //const client = new WebhookClient({url: `https://discord.com/api/webhooks/${data.token}`}, {allowedMentions: {}});
  const resp = await fetch(
    `https://discord.com/api/webhooks/${data.token}`,
    {
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payloadBuilder(data.webhook)),
      method: 'POST'
    });
  if(resp.status === 204) return true;
  const json = await resp.json();
  console.error(json);
  return {status: 'Error', message: `${resp.status}-${resp.statusText} > ${JSON.stringify(json, null, 0)}`}
});
