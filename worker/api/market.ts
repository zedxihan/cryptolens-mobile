import { Context, Hono } from 'hono';
import { fetchUpstream, type Env } from '../fetch';

const app = new Hono<{ Bindings: Env }>();

const useStats = (
  c: Context<{ Bindings: Env }>,
  routeKey: string,
  ttl: number,
) => {
  c.header('Cache-Control', `public, s-maxage=${ttl}`);
  return async <T>(path: string) =>
    fetchUpstream<T>({ routeKey, path, env: c.env, customTtl: ttl });
};

// CMC Routes
app.get('/cmc/fear-greed', async (c) => {
  const fetch = useStats(c, '/cmc', 3600);
  const res = await fetch<{ data?: any }>('/v3/fear-and-greed/latest');
  const data = res?.data;

  if (!data) return c.json(null);
  const index = Array.isArray(data) ? data[0] : data;

  return c.json({
    value: Number(index.value),
    label: index.value_classification,
  });
});

// others...

export default app;
