export default defineNuxtRouteMiddleware(async (to, _from) => {
  const user = useStrapiUser<any>();
  // const loader = useLoadingIndicator();

  const isJoinRoutePath = to.name === 'courses-id-join-hash';

  const learningPlanStore = useLearningPlanStore();
  const learningPlanId = parseInt(to.params.id.toString());

  await useAsyncData('user', () =>
    learningPlanStore.loadLearningPlan(learningPlanId),
  );

  if (!learningPlanStore.learningPlan) {
    navigateTo('/');
  }

  if (
    !learningPlanStore.userIsFacilitator &&
    !learningPlanStore.userIsActiveMember &&
    !learningPlanStore.userIsPendingMember
  ) {
    navigateTo('/courses/me');
  }

  if (learningPlanStore.userIsPendingMember && !isJoinRoutePath) {
    const invite = learningPlanStore.learningPlan?.invitation_links.find(
      (i) => {
        return i.emails_to_send?.includes(user?.value?.email);
      },
    );

    if (invite) {
      navigateTo(`/courses/${learningPlanId}/join/${invite.hash}`);
    }
  }
});
