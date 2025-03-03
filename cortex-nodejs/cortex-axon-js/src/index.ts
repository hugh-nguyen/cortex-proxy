// index.ts
import './patchAxios';  // ensures the patch is applied

export { axonExpressMiddleware } from './integrations/express';
export { setCurrentInboundHeaders } from './patchAxios';  // if needed
