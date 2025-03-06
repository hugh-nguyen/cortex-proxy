import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

let currentInboundHeaders: Record<string, any> = {};

// Helper to update the stored inbound headers.
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

  const version = Object.entries(currentInboundHeaders).find(
    ([key, _]) => key.toLowerCase() === 'x-stack-version'
  )?.[1];

  if (version && !('X-Stack-Version' in config.headers)) {
    config.headers['X-Stack-Version'] = version;
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

  const version = Object.entries(currentInboundHeaders).find(
    ([key, _]) => key.toLowerCase() === 'x-stack-version'
  )?.[1];

  if (version && !('X-Stack-Version' in config.headers)) {
    config.headers['X-Stack-Version'] = version;
  }
  console.log("!! 0.1.6 - Patched axios request called, forwarding X-Stack-Version:", version);
  return originalRequest.call(this, config) as Promise<R>;
};
