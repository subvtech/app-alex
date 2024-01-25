export default defineNuxtRouteMiddleware(async (to, _from) => {
  const user = useStrapiUser<UserSimple>();
  const loader = useLoadingIndicator();

  const isJoinRoutePath = to.name === 'courses-id-join-hash';

  const learningPlanStore = useLearningPlanStore();
  const learningPlanId = parseInt(to.params.id.toString());

  loader.start();

  await useAsyncData('user', () =>
    learningPlanStore.loadLearningPlan(learningPlanId),
  );

  if (!learningPlanStore.learningPlan) {
    loader.finish();
    return navigateTo('/');
  }

  if (
    !learningPlanStore.userIsFacilitator &&
    !learningPlanStore.userIsActiveMember &&
    !learningPlanStore.userIsPendingMember
  ) {
    loader.finish();
    return navigateTo('/courses/me');
  }

  if (learningPlanStore.userIsPendingMember && !isJoinRoutePath) {
    const invite = learningPlanStore.learningPlan?.invitation_links.find(
      (i) => {
        return i.emails_to_send?.includes(user?.value?.email);
      },
    );

    if (invite) {
      loader.finish();
      return navigateTo(`/courses/${learningPlanId}/join/${invite.hash}`);
    }
  }
});
