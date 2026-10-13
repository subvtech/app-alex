// Re-export strapi runtime types to provide compatibility with Vite 7 ESM package exports
export type * from '../node_modules/@nuxtjs/strapi/dist/runtime/types/index';
export type * from '../node_modules/@nuxtjs/strapi/dist/runtime/types/v4';

// Dummy runtime exports to satisfy any runtime imports of types across the project
export const Strapi4RequestParams = {};
export const Strapi4ResponseData = {};
export const Strapi4ResponseMany = {};
export const Strapi4ResponseSingle = {};
export const Strapi4Error = {};
export const StrapiUser = {};
export const StrapiRegistrationInfo = {};
export const StrapiAuthenticationResponse = {};
export const StrapiAuthProvider = {};
export const StrapiLocale = {};

export default {};
