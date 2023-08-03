import * as queries from '~/assets/queries';

export default {
  async asyncData({ error, params, route, $strapi }) {
    const graphql = useStrapiGraphQL();
    
    try {
      let user;
      if (process.env.isElectronEnv) {
        user = window.getCurrentUser();
        if (!user) {
          throw new Error('Usuário inexistente!');
        }
      } else {
        const { users } = await graphql({
          query: queries.user,
          variables: { q: { username: params.username } },
        });

        if (!users || !users[0]) {
          throw new Error('Usuário inexistente!');
        }

        user = users[0];
      }

      const breadcrumb = [
        { to: '/', iconName: 'home' },
        { to: `/profile/${user.username}`, label: user.fullname },
      ];

      if (route.name.includes('favorites')) {
        breadcrumb.push({ label: 'Planos Salvos' });
      } else if (route.name.includes('learning-plans')) {
        breadcrumb.push({ label: 'Planos de Aprendizagem' });
      } else if (route.name.includes('managment')) {
        breadcrumb.push({ label: 'Gerênciar Usuários' });
      }

      return { breadcrumb, user };
    } catch (err) {
      console.log(err);
      return error({ message: error.message, statusCode: 404 });
    }
  },
  data() {
    return {
      user: {},
      breadcrumb: [],
    };
  },
};
