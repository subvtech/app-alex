export default defineNuxtRouteMiddleware(async (to, _from) => {
  // const loader = useLoadingIndicator();

  const trailStore = useTrailStore();
  const trailId = parseInt(to.params.trailId.toString());
  console.log('trailId', trailId);
  // loader.start();

  await useAsyncData('user', () => trailStore.loadTrailData(trailId));

  if (!trailStore.trail) {
    //   loader.finish();
    // return navigateTo('/');
  }
});
