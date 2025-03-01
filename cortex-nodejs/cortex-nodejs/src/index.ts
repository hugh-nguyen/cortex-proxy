import type { Application } from 'express';
import { captureInboundHeaders } from './middleware';
import { setCurrentInboundHeaders } from './patchAxios';

// Import so the monkey patch is applied globally
import './patchAxios';

/**
 * 1-liner approach to automatically forward inbound headers in axios calls.
 * 
 * - Installs our captureInboundHeaders middleware
 * - Each request, sets the inbound headers in a global variable used by the axios monkey patch
 */
export function setupAutoHeaderForwarding(app: Application) {
  console.log(`!! 1 index setupAutoHeaderForwarding - v0.123.11`)
  app.use((req, res, next) => {
    captureInboundHeaders(req, res, () => {
      const inbound = req.app.get('inboundHeaders') || {};
      setCurrentInboundHeaders(inbound);
      next();
    });
  });
}
