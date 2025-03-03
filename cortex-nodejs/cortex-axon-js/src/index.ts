import type { Application } from 'express';
import { captureInboundHeaders } from './middleware';
import { setCurrentInboundHeaders } from './patchAxios';

import './patchAxios';

export function setupAutoHeaderForwarding(app: Application) {
  app.use((req, res, next) => {
    captureInboundHeaders(req, res, () => {
      const inbound = req.app.get('inboundHeaders') || {};
      setCurrentInboundHeaders(inbound);
      next();
    });
  });
}
