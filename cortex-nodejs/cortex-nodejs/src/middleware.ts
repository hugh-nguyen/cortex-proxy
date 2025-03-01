import type { Request, Response, NextFunction } from 'express';

export function captureInboundHeaders(req: Request, _res: Response, next: NextFunction) {
  // Store inbound headers in the request's app context
  console.log(`!! 2 middleware captureInboundHeaders - v0.123.11`)
  console.log(req.headers)
  req.app.set('inboundHeaders', { ...req.headers });
  next();
}
