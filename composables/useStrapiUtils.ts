import { Strapi4RequestParams } from '@nuxtjs/strapi/dist/runtime/types';

function formatResult<T>(result: any): T {
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

  async function find<T>(
    contentType: string,
    params?: Strapi4RequestParams,
  ): Promise<{ meta: any; data: T[] }> {
    const result = await strapi.find<T>(contentType, params);

    return { meta: result.meta, data: result.data.map(formatResult<T>) };
  }
  async function create<T>(
    contentType: string,
    data: Partial<T>,
  ): Promise<{ meta: any; data: T }> {
    const result = await strapi.create<T>(contentType, data);
    return { meta: result.meta, data: formatResult<T>(result.data) };
  }

  return { findOne, find, formatResult, create };
};
