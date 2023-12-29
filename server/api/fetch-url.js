import Parser from '@postlight/parser';

export default defineEventHandler(async (event) => {
  const url = getQuery(event);
  console.log('teste');
  const data = await Parser.parse(url.url);
  const domain =
    data.domain && typeof data.domain === 'string' ? data.domain : '';
  const parsed = {
    success: 1,
    meta: {
      title: data.title,
      domain,
      description: data.excerpt,
      image: data.lead_image_url ? { url: data.lead_image_url } : undefined,
    },
  };
  if (data.error) {
    return { success: 0 };
  }
  return { ...parsed };
});
