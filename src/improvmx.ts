import { z } from "zod"

export const ImprovEmailWebhookContact = z.object({
  name: z.string().nullable().optional(),
  email: z.string(),
})
export type ImprovEmailWebhookContact = z.TypeOf<typeof ImprovEmailWebhookContact>;


export const ImprovEmailWebhookInline = z.object({
  type: z.string(),
  name: z.string(),
  content: z.string(),
  cid: z.string(),
})
export type ImprovEmailWebhookInline = z.TypeOf<typeof ImprovEmailWebhookInline>;


export const ImprovEmailWebhookAttachment = z.object({
  type: z.string(),
  name: z.string(),
  content: z.string(),
})
export type ImprovEmailWebhookAttachment = z.TypeOf<typeof ImprovEmailWebhookAttachment>;


export const ImprovEmailWebhook = z.object({
  headers: z.record(z.string(), z.union([z.string(), z.null(), z.record(z.string(), z.any()), z.array(z.string())])),
  to: z.array(ImprovEmailWebhookContact),
  from: ImprovEmailWebhookContact,
  subject: z.string().nullable().optional(),
  "message-id": z.string(),
  date: z.string(),
  "return-path": z.object({
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional()
  }).optional(),
  timestamp: z.number(),
  text: z.string(),
  html: z.string().nullable().optional(),
  inlines: z.array(ImprovEmailWebhookInline).nullable().optional(),
  attachments: z.array(ImprovEmailWebhookAttachment).nullable().optional(),
  raw_url: z.string().nullable().optional(),
  envelope: z.object({
    return_path: z.string().nullable().optional(),
    recipient: z.string().nullable(),
    hostname: z.string().nullable().optional(),
    remote_ip: z.string().nullable()
  }),
});
export type ImprovEmailWebhook = z.TypeOf<typeof ImprovEmailWebhook>;



export function censorPayload(data: ImprovEmailWebhook): ImprovEmailWebhook {
  //const toCensor = [];
  const cp: ImprovEmailWebhook = JSON.parse(JSON.stringify(data));
  //if(cp.envelope.return_path) toCensor.push(cp.envelope.return_path)
  //if(cp['return-path']?.email) toCensor.push(cp['return-path'].email)
  //if(cp['return-path']?.name) toCensor.push(cp['return-path'].name)
  delete cp.envelope.return_path;
  delete cp['return-path'];
  //let ff = JSON.stringify(cp);
  /*toCensor.forEach((c) => {
    ff = ff.replaceAll(c.toLowerCase(), '<censored>')
  })*/
  return cp;
}
