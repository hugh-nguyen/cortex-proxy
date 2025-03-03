// src/integrations/express.ts
import type { Request, Response, NextFunction } from 'express';
import { setCurrentInboundHeaders } from '../patchAxios';

/**
 * Express middleware that captures inbound headers
 * and calls setCurrentInboundHeaders so the patched Axios
 * can forward them automatically.
 */
export function instrumentWithAxon(req: Request, _res: Response, next: NextFunction) {
  setCurrentInboundHeaders({ ...req.headers });
  next();
}
