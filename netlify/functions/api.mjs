import {Readable} from 'node:stream';
import {handleRequest} from '../../server.mjs';

export default async function api(request){
  const incoming=new URL(request.url);
  const origin=request.headers.get('origin');
  const allowedOrigin=origin===incoming.origin||origin==='https://ketakisantoshnikure.github.io';
  if(origin&&!allowedOrigin)return Response.json({error:'This app origin is not allowed.'},{status:403});
  const corsHeaders=origin&&allowedOrigin?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET,POST,PATCH,DELETE,OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'}:{};
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:corsHeaders});
  // Never fall back to an ephemeral local file database on Netlify. The hosted
  // instance must have the server-side Supabase credentials configured.
  if(!process.env.SUPABASE_URL||!(process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY)){
    return Response.json({error:'Hosted database is not configured. Add the Supabase URL and server-only Supabase secret key in Netlify environment variables.'},{status:503,headers:corsHeaders});
  }
  const action=incoming.searchParams.get('gatha')||'health';
  const body=Buffer.from(await request.arrayBuffer());
  const req=Readable.from(body.length?[body]:[]);
  req.method=request.method;
  req.url=`/?gatha=${encodeURIComponent(action)}`;
  req.headers=Object.fromEntries(request.headers.entries());
  req.headers.host ||= incoming.host;
  req.socket={remoteAddress:request.headers.get('x-nf-client-connection-ip')||'netlify'};
  let status=200,responseBody=null;
  const headers={};
  const res={
    setHeader(name,value){headers[name]=value},
    writeHead(code,values={}){status=code;Object.assign(headers,values)},
    end(value){responseBody=value??null}
  };
  await handleRequest(req,res);
  return new Response(responseBody,{status,headers:{...headers,...corsHeaders}});
}
