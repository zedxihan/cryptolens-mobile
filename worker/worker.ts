interface Env {
  CG_KEY?: string;
  CMC_KEY?: string;
  APP_SECRET?: string;
}

interface RouteConfig {
  base: string;
  ttl: number;
  keyHeader?: string;
  envKey?: keyof Env;
}

const ALLOWED_ORIGIN = 'https://cryptolens.link';

const ROUTES: Record<string, RouteConfig> = {
  '/coingecko': {
    base: 'https://api.coingecko.com/api/v3',
    ttl: 60,
    keyHeader: 'x-cg-demo-api-key',
    envKey: 'CG_KEY',
  },
  '/binance': {
    base: 'https://data-api.binance.vision/api/v3',
    ttl: 5,
  },
  '/binancef': {
    base: 'https://fapi.binance.com',
    ttl: 5,
  },
  '/cmc': {
    base: 'https://pro-api.coinmarketcap.com',
    ttl: 60,
    keyHeader: 'X-CMC_PRO_API_KEY',
    envKey: 'CMC_KEY',
  },
  '/avatars': {
    base: 'https://ui-avatars.com/api',
    ttl: 86400,
  },
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const secret = request.headers.get('X-App-Secret');

    // Dynamic CORS Setup
    const isAllowedOrigin =
      origin === ALLOWED_ORIGIN || origin?.endsWith('.cryptolens.link');
    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin! : ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-App-Secret',
      Vary: 'Origin',
    };

    // 1. Security Check
    if (env.APP_SECRET && secret !== env.APP_SECRET && !isAllowedOrigin) {
      return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders);
    }

    // 2. Preflight & Method Check
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return jsonResponse({ error: 'Method Not Allowed' }, 405, corsHeaders);
    }

    // 3. Routing
    const match = Object.entries(ROUTES).find(([r]) =>
      url.pathname.startsWith(r),
    );
    if (!match) {
      return jsonResponse(
        {
          message: 'CryptoLens API Proxy',
          routes: Object.keys(ROUTES).map((r) => `${r}/*`),
        },
        404,
        corsHeaders,
      );
    }

    const [routePath, config] = match;
    const upstreamURL =
      config.base + url.pathname.slice(routePath.length) + url.search;

    // 4. Upstream Request Construction
    const headers = new Headers({ 'User-Agent': 'CryptoLens Proxy' });
    if (config.keyHeader && config.envKey && env[config.envKey]) {
      headers.set(config.keyHeader, env[config.envKey] as string);
    }

    try {
      const upstream = await fetch(upstreamURL, {
        method: request.method,
        headers,
        cf: { cacheEverything: true, cacheTtl: config.ttl },
      } as any);

      // 5. Response Construction
      const responseHeaders = new Headers(upstream.headers);
      Object.entries(corsHeaders).forEach(([k, v]) =>
        responseHeaders.set(k, v),
      );
      responseHeaders.set('Cache-Control', `public, s-maxage=${config.ttl}`);

      return new Response(upstream.body, {
        status: upstream.status,
        headers: responseHeaders,
      });
    } catch (err) {
      return jsonResponse(
        { error: 'Upstream connection failed', details: String(err) },
        502,
        corsHeaders,
      );
    }
  },
};

function jsonResponse(
  data: any,
  status = 200,
  headers: Record<string, string> = {},
) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}
