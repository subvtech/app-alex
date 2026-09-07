import { Strapi4RequestParams } from '@nuxtjs/strapi/dist/runtime/types';

export function formatResult<T>(result: any): T {
  const resultFormatted = { id: result.id, ...result.attributes };

  Object.keys(resultFormatted).forEach((attribute) => {
    resultFormatted[attribute] = formatAttribute(resultFormatted[attribute]);
  });

  return resultFormatted;
}

function formatAttribute(attribute) {
  const value = attribute?.data;
  if (!value && value === undefined) {
    return attribute;
  }

  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map(formatResult);
  } else {
    return formatResult(value);
  }
}

export const useStrapiUtils = () => {
  const strapi = useStrapi();

  async function findOne<T>(
    contentType: string,
    id: number,
    params?: Strapi4RequestParams,
  ): Promise<{ meta: any; data: T }> {
    const result = await strapi.findOne<T>(contentType, id, params);

    return { ...result, data: formatResult<T>(result.data) };
  }

  async function find<T>(contentType: string, params?: Strapi4RequestParams): Promise<{ meta: any; data: T[] }> {
    const result = await strapi.find<T>(contentType, params);
    const formattedResult = result.data ? result.data.map(formatResult<T>) : (result as unknown as T[]);

    return {
      meta: result.meta,
      data: formattedResult,
    };
  }

  async function findAll<T>(
    contentType: string,
    params?: Strapi4RequestParams,
    pageSize = 100,
  ): Promise<{ meta: any; data: T[] }> {
    let page = 1;
    let pageCount = 1;
    const allFormattedData: T[] = [];
    let lastMeta: any = null;

    do {
      const mergedParams: Strapi4RequestParams = {
        ...params,
        pagination: {
          ...(params?.pagination && 'pageSize' in params.pagination ? params.pagination : {}),
          page,
          pageSize,
        },
      };

      const result = await strapi.find<T>(contentType, mergedParams);
      const formattedResult = result.data ? result.data.map(formatResult<T>) : (result as unknown as T[]);
      if (Array.isArray(formattedResult)) {
        allFormattedData.push(...formattedResult);
      }

      lastMeta = result.meta;
      pageCount = (result.meta as any)?.pagination?.pageCount ?? 1;
      page += 1;
    } while (page <= pageCount);

    return {
      meta: lastMeta,
      data: allFormattedData,
    };
  }
  async function create<T>(contentType: string, data: Partial<T>): Promise<{ meta: any; data: T }> {
    const result = await strapi.create<T>(contentType, data);
    return { meta: result.meta, data: formatResult<T>(result.data) };
  }

  async function update<T>(contentType: string, id: number, data: Partial<T>): Promise<{ meta: any; data: T }> {
    const result = await strapi.update<T>(contentType, id, data);
    return { meta: result.meta, data: formatResult<T>(result.data) };
  }

  async function destroy(contentType: string, id: number): Promise<any> {
    return await strapi.delete(contentType, id);
  }
  return { findOne, find, findAll, formatResult, create, update, destroy };
};
