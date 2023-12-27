import { Strapi4RequestParams } from '@nuxtjs/strapi/dist/runtime/types';

function formatResult(result: any) {
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
  ): Promise<T> {
    const result = await strapi.findOne<T>(contentType, id, params);

    return formatResult(result.data);
  }

  async function find<T>(
    contentType: string,
    params?: Strapi4RequestParams,
  ): Promise<T[]> {
    const result = await strapi.find<T>(contentType, params);

    return result.data.map(formatResult);
  }

  return { findOne, find, formatResult };
};
