export default defineNuxtRouteMiddleware(() => {
  const user = useStrapiUser();
  const pendingStore = useGooglePendingStore();

  if (!user.value) return navigateTo('/login', { replace: true });
  if (!pendingStore.hasPending) return navigateTo('/', { replace: true });
});
