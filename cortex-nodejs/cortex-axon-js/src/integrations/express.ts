import type { Request, Response, NextFunction } from 'express';
import { setCurrentInboundHeaders } from '../patchAxios';

export function instrumentWithAxon(req: Request, _res: Response, next: NextFunction) {
  setCurrentInboundHeaders({ ...req.headers });
  next();
}
