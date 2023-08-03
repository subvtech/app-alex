<script>
const { find } = useStrapi();
const user = useStrapiUser();

export default {

  async middleware({ redirect, route, $strapi }) {
    if (user) {
      return redirect('/');
    }

    const { fullPath, path, params } = route;
    const query = fullPath.replace(path, '');

    try {
      const url = `/auth/${params.provider}/callback${query}`;
      const res = await find(url);

      $strapi.$cookies.set('strapi_jwt', res.jwt);
      $strapi.user = res.user;

      redirect('/');
    } catch (err) {
      redirect('/login');
    }
  },
};
</script>
