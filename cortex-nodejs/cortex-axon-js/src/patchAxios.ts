import axios, {
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

let currentInboundHeaders: Record<string, any> = {};

export function setCurrentInboundHeaders(headers: Record<string, any>) {
  currentInboundHeaders = headers;
}

const originalRequest = axios.request;

axios.request = function patchedRequest<
  T = any,
  R = AxiosResponse<T, any>,
  D = any
>(config: AxiosRequestConfig<D>): Promise<R> {
  config = config || {};
  config.headers = config.headers || {};

  for (const [k, v] of Object.entries(currentInboundHeaders)) {
    if (k.toLowerCase() === 'host') continue;
    if (!(k in config.headers)) {
      config.headers[k] = v;
    }
  }
  return originalRequest.call(this, config) as Promise<R>;
};

axios.Axios.prototype.request = function patchedRequest<
  T = any,
  R = AxiosResponse<T, any>,
  D = any
>(config: AxiosRequestConfig<D>): Promise<R> {
  config = config || {};
  config.headers = config.headers || {};

  for (const [k, v] of Object.entries(currentInboundHeaders)) {
    if (k.toLowerCase() === 'host') continue;
    if (!(k in config.headers)) {
      config.headers[k] = v;
    }
  }
  return originalRequest.call(this, config) as Promise<R>;
};