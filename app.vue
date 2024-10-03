<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
    <Toaster position="top-center" />
  </NuxtLayout>
</template>

<style lang="scss">
@use 'config/scss/index.scss';
.page-enter-active,
.page-leave-active {
  transition: all 0.1s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
