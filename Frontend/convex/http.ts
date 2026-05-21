import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api } from './_generated/api';

const http = httpRouter();

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

http.route({
  path: '/agents',
  method: 'GET',
  handler: httpAction(async (ctx) => {
    const agents = await ctx.runQuery(api.agents.list);
    return new Response(JSON.stringify({ success: true, count: agents.length, agents }), { headers: CORS });
  }),
});

http.route({
  path: '/agents',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const result = await ctx.runMutation(api.agents.add, body);
    return new Response(JSON.stringify({ success: true, agent: result }), { headers: CORS, status: 201 });
  }),
});

http.route({
  path: '/agents',
  method: 'DELETE',
  handler: httpAction(async (ctx) => {
    const result = await ctx.runMutation(api.agents.clear);
    return new Response(JSON.stringify({ success: true, ...result }), { headers: CORS });
  }),
});

export default http;
