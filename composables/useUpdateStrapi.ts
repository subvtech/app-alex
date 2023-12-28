export const useUpdateStrapi = () => {
  const { find, findOne } = useStrapi();
  const route = useRoute();
  const router = useRouter();
  const { id, username } = useStrapiUser<User>().value;

  const userStore = useUserStore();
  const messageStore = useMessageStore();
  const updateUser = async (show = true, message?) => {
    const populate = [
      'institutions.cover',
      'cover',
      'avatar',
      'learningPlans',
      'socials',
      'trails',
      'role',
      'tags',
      'user_descriptions',
      'user_wallet',
    ];
    let user;
    const canEdit = username === route.params.username;
    console.log(route.params);
    console.log(username, route.params.username);

    if (canEdit) {
      user = await findOne<User>('users', id, {
        populate: populate,
      });
    } else {
      user = (
        await find<User>('users', {
          filters: { username: route.params.username },
          populate: populate,
        })
      )[0];
    }

    if (!user) {
      router.push({ path: '/' });
      return;
    }

    const learningPlanMembers = (
      await find('learning-plan-members', {
        filters: {
          user: user.id,
        },
        populate: ['learningplan.tasks'],
      })
    ).data;
    const learningPlans = learningPlanMembers.length;

    const tasks = learningPlanMembers.reduce((count, item) => {
      return (item.attributes as any).learningplan.data.attributes.tasks.data
        .length;
    }, 0);

    user.tasks = tasks;
    user.learningPlans = learningPlans;
    user.canEdit = canEdit;
    Object.assign(userStore, user);

    messageStore.setMessage(message ?? 'done', 'green', show);

    return user;
  };

  return { updateUser };
};
