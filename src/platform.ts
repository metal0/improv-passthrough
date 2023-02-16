import { ImprovEmailWebhook } from './improvmx.js';
import { Env } from './index.js';



type BridgeData = {webhook: ImprovEmailWebhook, token: string, request: Request, env: Env, ctx: ExecutionContext};
export type BridgeProcessor = ((data: BridgeData) => Promise<true | {status: string, message: string}>);
export const platforms: {[key: string]: BridgePlatform} = {};

export class BridgePlatform {
  name: string;
  handler: BridgeProcessor;
  constructor(name: string, handler: BridgeProcessor) {
    this.name = name;
    this.handler = handler;
    platforms[name] = this;
    return this;
  }
}
