import { ImprovEmailWebhook } from '../../improvmx.js';
import { BridgePlatform } from '../../platform.js';


export type HookshotWebhookOptions = {
  text: string; // raw
  html?: string; // HTML
  username: string;
}


function renderEmailBodyText(text: string, json: string, sent_to: string[]): string {
  return `${text}
  <root>
      <details>
          <summary><b>Email Payload JSON:</b></summary>
          <pre><code>${json}</code></pre>
      </details>
      <small>(Sent to ${sent_to.join(',')})
  </root>`
}

function payloadBuilder(webhook: ImprovEmailWebhook): HookshotWebhookOptions {
  const newRawCopy: ImprovEmailWebhook = JSON.parse(JSON.stringify(webhook));
  newRawCopy.headers = {};
  newRawCopy.text = `<hidden>`;
  newRawCopy.html = ``;
  const rawPayload = JSON.stringify(newRawCopy, null, 1);
  const rawText = `${webhook.text}`
  const sentTo = webhook.to.map(e => e.name ? `${e.name} <${e.email}>` : e.email);
  const htmlText = renderEmailBodyText(webhook.html ?? webhook.text, rawPayload, sentTo);
  const msg: HookshotWebhookOptions = {
    username: `✉ ${webhook.envelope.recipient} (${webhook.subject ?? 'Empty subject'})`,
    text: rawText,
    html: htmlText
  }
  return msg;
}

new BridgePlatform('matrix-hookshot', async (data) => {
  const resp = await fetch(
    `${data.env.MATRIX_HOOKSHOT_HOST}/${data.token}`,
    {
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payloadBuilder(data.webhook)),
      method: 'POST'
    });
  if(resp.status === 200) return true;
  console.log(resp.status, resp.statusText)
  const json = await resp.json();
  console.error(json);
  return {status: 'Error', message: `${resp.status}-${resp.statusText} > ${JSON.stringify(json, null, 0)}`}
});
