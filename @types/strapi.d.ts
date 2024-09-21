type DefaultStrapiUser = import('@nuxtjs/strapi/dist/runtime/types').StrapiUser;

interface StrapiUser extends NonNullable<DefaultStrapiUser> {
  fullname?: string;
  permissions: string[];
  role: {
    createdAt: string;
    description: string;
    id: number;
    name: string;
    permissions?: {
      [apiName: string]: {
        controllers: {
          [controllerName: string]: {
            [actionName: string]: {
              enabled: boolean;
              policy: string;
            };
          };
        };
      };
    };
    type: string;
    updatedAt: string;
  };
}
