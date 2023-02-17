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
  headers: z.record(z.string(), z.union([z.string(), z.record(z.string(), z.any()), z.array(z.string())])),
  to: z.array(ImprovEmailWebhookContact),
  from: ImprovEmailWebhookContact,
  subject: z.string().optional(),
  "message-id": z.string(),
  date: z.string(),
  "return-path": z.object({
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional()
  }).optional(),
  timestamp: z.number(),
  text: z.string(),
  html: z.string().optional(),
  inlines: z.array(ImprovEmailWebhookInline).optional(),
  attachments: z.array(ImprovEmailWebhookAttachment).optional(),
  raw_url: z.string().optional(),
  envelope: z.object({
    return_path: z.string().optional(),
    recipient: z.string(),
    hostname: z.string().optional(),
    remote_ip: z.string()
  }),
});
export type ImprovEmailWebhook = z.TypeOf<typeof ImprovEmailWebhook>;

