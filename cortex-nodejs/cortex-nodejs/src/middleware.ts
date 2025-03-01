import type { Request, Response, NextFunction } from 'express';

export function captureInboundHeaders(req: Request, _res: Response, next: NextFunction) {
  // Store inbound headers in the request's app context
  req.app.set('inboundHeaders', { ...req.headers });
  next();
}
