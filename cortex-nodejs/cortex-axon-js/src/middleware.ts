import type { Request, Response, NextFunction } from 'express';

export function captureInboundHeaders(req: Request, _res: Response, next: NextFunction) {
  req.app.set('inboundHeaders', { ...req.headers });
  next();
}
