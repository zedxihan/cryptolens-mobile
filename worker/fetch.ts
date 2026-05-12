/// <reference types="@cloudflare/workers-types" />
export interface Env {
  CG_KEY?: string;
  CMC_KEY?: string;
  SOSOVALUE_KEY?: string;
  APP_SECRET?: string;
  VERSION?: string;
  ICONS: KVNamespace;
}

export interface RouteConfig {
  base: string;
  ttl: number;
  keyHeader?: string;
  envKey?: keyof Env;
}

export interface UpstreamOptions {
  routeKey: string;
  path: string;
  env: Env;
  customTtl?: number;
}

export const ROUTES: Record<string, RouteConfig> = {
  '/coingecko': {
    base: 'https://api.coingecko.com/api/v3',
    ttl: 60,
    keyHeader: 'x-cg-demo-api-key',
    envKey: 'CG_KEY',
  },
  '/binance': { base: 'https://data-api.binance.vision/api/v3', ttl: 5 },
  '/binancef': { base: 'https://fapi.binance.com', ttl: 5 },
  '/cmc': {
    base: 'https://pro-api.coinmarketcap.com',
    ttl: 60,
    keyHeader: 'X-CMC_PRO_API_KEY',
    envKey: 'CMC_KEY',
  },
  '/sosovalue': {
    base: 'https://openapi.sosovalue.com/openapi/v1',
    ttl: 60,
    keyHeader: 'x-soso-api-key',
    envKey: 'SOSOVALUE_KEY',
  },
  '/avatars': { base: 'https://ui-avatars.com/api', ttl: 86400 },
};

export async function requestUpstream(
  options: UpstreamOptions,
): Promise<Response> {
  const { routeKey, path, env, customTtl } = options;
  const config = ROUTES[routeKey];
  if (!config) throw new Error(`Unknown route: ${routeKey}`);

  const url = `${config.base}${path}`;
  const headers = new Headers({ 'User-Agent': 'CryptoLens Worker' });

  if (config.keyHeader && config.envKey && env[config.envKey]) {
    headers.set(config.keyHeader, env[config.envKey] as string);
  }

  const ttl = customTtl ?? config.ttl;

  return fetch(url, {
    headers,
    cf: { cacheEverything: true, cacheTtl: ttl },
  } as any);
}

export async function fetchUpstream<T>(options: UpstreamOptions): Promise<T> {
  const res = await requestUpstream(options);

  if (!res.ok) {
    throw new Error(`Upstream API error (${options.routeKey}): ${res.status}`);
  }

  const data = await res.json();
  const fetchedAt = res.headers.get('Date');

  return data && typeof data === 'object' && !Array.isArray(data)
    ? { ...data, fetchedAt }
    : data;
}
