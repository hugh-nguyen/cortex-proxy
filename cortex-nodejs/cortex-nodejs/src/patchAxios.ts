import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance
} from 'axios';

console.log('register/patchAxios axios path:', require.resolve('axios'));

// We'll keep a global variable for "current headers" to forward
// (In real production with concurrency, you'd want something like AsyncLocalStorage.)
let currentInboundHeaders: Record<string, any> = {};

// Helper to set inbound headers for each request
export function setCurrentInboundHeaders(headers: Record<string, any>) {
  console.log(`!! 3 patchAxios setCurrentInboundHeaders - v0.123.11`)
  currentInboundHeaders = headers;
}

// Save the original axios.request so we can wrap it
const originalRequest = axios.request;

/**
 * Monkey-patch `axios.request` to automatically merge inbound headers.
 * This matches the generic signature <T, R, D> so TS doesn't complain
 * about returning a `Promise<unknown>` instead of `Promise<R>`.
 */
axios.request = function patchedRequest<
  T = any,
  R = AxiosResponse<T, any>,
  D = any
>(config: AxiosRequestConfig<D>): Promise<R> {
  console.log(`!! 4 patchAxios patchedRequest - v0.123.11`)
  config = config || {};
  config.headers = config.headers || {};

  // Merge inbound headers, skipping "host" or duplicates
  for (const [k, v] of Object.entries(currentInboundHeaders)) {
    if (k.toLowerCase() === 'host') continue;
    if (!(k in config.headers)) {
      config.headers[k] = v;
    }
  }
  console.log(`!! patchAxios patchedRequest - v0.123.11`, currentInboundHeaders)

  // Call the original request, cast to Promise<R> so TS is happy
  return originalRequest.call(this, config) as Promise<R>;
};


axios.Axios.prototype.request = function patchedRequest<
  T = any,
  R = AxiosResponse<T, any>,
  D = any
>(config: AxiosRequestConfig<D>): Promise<R> {
  console.log(`!! 4 patchAxios patchedRequest - v0.123.11`)
  config = config || {};
  config.headers = config.headers || {};

  // Merge inbound headers, skipping "host" or duplicates
  for (const [k, v] of Object.entries(currentInboundHeaders)) {
    if (k.toLowerCase() === 'host') continue;
    if (!(k in config.headers)) {
      config.headers[k] = v;
    }
  }
  console.log(`!! patchAxios patchedRequest - v0.123.11`, currentInboundHeaders)

  // Call the original request, cast to Promise<R> so TS is happy
  return originalRequest.call(this, config) as Promise<R>;
};