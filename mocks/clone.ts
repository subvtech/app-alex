import { HttpResponse } from 'msw';

const STRAPI_URL = useRuntimeConfig().public.strapiUrl;

export async function clone({ request }: { request: Request }) {
  const url = new URL(request.url);
  const path = url.pathname.split('/_/api')[1];
  const newUrl = `${STRAPI_URL}/api${path}${url.search}`;

  const res = await fetch(
    new Request(newUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      mode: request.mode,
      credentials: request.credentials,
      cache: request.cache,
      redirect: request.redirect,
      referrer: request.referrer,
      integrity: request.integrity,
    }),
  );

  const type = res.headers.get('Content-Type') || 'application/octet-stream';

  if (type.includes('application/json')) {
    return HttpResponse.json(await res.json());
  } else if (type.includes('text/')) {
    return HttpResponse.text(await res.text());
  } else {
    return HttpResponse.arrayBuffer(await res.arrayBuffer());
  }
}
