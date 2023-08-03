import * as queries from '~/assets/queries';

export default async function login({ error, redirect, route, $strapi }) {
  const authRoutes = ['login', 'login-provider', 'forgot', 'register', 'reset'];
  const graphql = useStrapiGraphQL();
  const user = useStrapiUser();

  if (authRoutes.includes(route.name)) {
    return user ? redirect('/') : null;
  }

  if (!user) {
    return redirect('/login');
  }

  // TODO: Verificar se os dados obrigatórios foram informados.
  // Necessário quando a autenticação é feita via rede social.
  // if (route.path === '/complete' && $strapi.user.userdata) {
  //   return redirect('/');
  // }

  // if (!$strapi.user.userdata) {
  //   return redirect('/complete');
  // }

  if (!user.permissions) {
    try {
      const { role } = await graphql({
        query: queries.role,
        variables: {
          id: user.role.id,
          q: { enabled: true },
        },
      });

      if (!role) {
        throw Error('Permissão negada!'); // eslint-disable-line
      }

      user.permissions = role.permissions
        .filter((p) => p.enabled)
        .reduce(
          (r, p) =>
            Object.assign({}, r, {
              [p.controller]: (r[p.controller] || []).concat(p.action),
            }),
          {},
        );

      if (process.env.isElectronEnv) {
        user = await window.saveCurrentUser(user);
      }
    } catch (err) {
      error(err);
    }
  }
}
