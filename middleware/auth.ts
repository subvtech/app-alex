export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useStrapiUser();
  if (!user.value) {
    if (to.fullPath === '/login' || to.fullPath === '/') {
      return navigateTo('/login', { replace: true });
    }
    useCookie('redirect', { path: '/', maxAge: 900 }).value = to.fullPath;
    return navigateTo('/login?redirect=' + to.fullPath, { replace: true });
  }
});
