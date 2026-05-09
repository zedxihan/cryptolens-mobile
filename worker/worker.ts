import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { cors } from 'hono/cors';

import binanceApp from './api/binance';
import coingeckoApp from './api/coingecko';
import marketApp from './api/market';

import { Env, requestUpstream, ROUTES } from './fetch';

const app = new Hono<{ Bindings: Env }>();

app.get(
  '*',
  cache({
    cacheName: 'cryptolens-api',
    cacheControl: 'max-age=5',
  }),
);

// basic CORS(web) & security
app.use(
  '*',
  cors({
    origin: 'https://cryptolens.link',
    allowMethods: ['GET', 'HEAD', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'X-App-Secret'],
    maxAge: 86400,
  }),
);

app.use('*', async (c, next) => {
  if (!c.env.APP_SECRET) return next();

  const secret = c.req.header('X-App-Secret');
  if (secret !== c.env.APP_SECRET) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
});

// global error handler
app.onError((err, c) => {
  console.error(`[Worker Error]: ${err.message}`);
  return c.json({ error: err.message || 'Upstream connection failed' }, 502);
});

// API routes
app.route('/api/coingecko', coingeckoApp);
app.route('/api/binance', binanceApp);
app.route('/api/market', marketApp);

// proxy routes
Object.keys(ROUTES).forEach((routePath) => {
  app.get(`${routePath}/*`, async (c) => {
    const url = new URL(c.req.url);
    const pathAndSearch = url.pathname.slice(routePath.length) + url.search;

    const upstream = await requestUpstream({
      routeKey: routePath,
      path: pathAndSearch,
      env: c.env,
    });

    const response = new Response(upstream.body, upstream); // clone
    response.headers.set(
      'Cache-Control',
      `public, s-maxage=${ROUTES[routePath].ttl}`,
    );
    return response;
  });
});

app.notFound((c) => {
  return c.json(
    {
      message: 'CryptoLens Hono API',
      version: c.env.VERSION,
      routes: Object.keys(ROUTES),
    },
    404,
  );
});

export default app;
