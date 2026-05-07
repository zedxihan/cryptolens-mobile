import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  CG_KEY?: string;
  CMC_KEY?: string;
  APP_SECRET?: string;
}

const app = new Hono<{ Bindings: Env }>();

// basic CORS(web)
app.use(
  '*',
  cors({
    origin: 'https://cryptolens.link',
    allowMethods: ['GET', 'HEAD', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-App-Secret'],
    maxAge: 86400,
  }),
);

// security middleware
app.use('*', async (c, next) => {
  if (!c.env.APP_SECRET) return next();

  const secret = c.req.header('X-App-Secret');
  if (secret !== c.env.APP_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
});

// proxy
interface RouteConfig {
  base: string;
  ttl: number;
  keyHeader?: string;
  envKey?: keyof Env;
}

const ROUTES: Record<string, RouteConfig> = {
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
  '/avatars': { base: 'https://ui-avatars.com/api', ttl: 86400 },
};

Object.entries(ROUTES).forEach(([routePath, config]) => {
  app.get(`${routePath}/*`, async (c) => {
    const url = new URL(c.req.url);
    const upstreamURL =
      config.base + url.pathname.slice(routePath.length) + url.search;
    const headers = new Headers({ 'User-Agent': 'CryptoLens Proxy' });

    if (config.keyHeader && config.envKey && c.env[config.envKey]) {
      headers.set(config.keyHeader, c.env[config.envKey] as string);
    }

    try {
      const upstream = await fetch(upstreamURL, {
        headers,
        cf: { cacheEverything: true, cacheTtl: config.ttl },
      } as any);

      const response = new Response(upstream.body, upstream);
      response.headers.set('Cache-Control', `public, s-maxage=${config.ttl}`);
      return response;
    } catch (err) {
      return c.json({ error: 'Upstream connection failed' }, 502);
    }
  });
});

app.notFound((c) => {
  return c.json(
    { message: 'CryptoLens Hono API', routes: Object.keys(ROUTES) },
    404,
  );
});

export default app;
