<template>
  <div class="d-flex align-center">
    <v-btn
      v-if="goBack"
      icon="mdi-chevron-left"
      class="mr-2"
      variant="text"
      color="gray-900"
      width="36"
      height="36"
      @click="back"
    />
    <div v-if="title || firstTitle" class="text-h3">
      {{ title || firstTitle }}
    </div>
    <v-divider
      v-if="title || firstTitle"
      vertical
      :thickness="2"
      color="gray-700"
      class="ml-4"
      inset
    />
    <v-breadcrumbs :items="crumbs" density="compact">
      <template #divider>
        <v-icon icon="mdi-chevron-right" color="gray-300" />
      </template>
      <template #title="{ item }">
        <v-breadcrumbs-item>
          <nuxt-link
            :to="item.href"
            class="text-body-1 breadcrumbs-item text-gray-900"
            :disabled="item.disabled"
            exact
          >
            {{ item.title }}
          </nuxt-link>
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script setup lang="ts">
interface breadcrumb {
  title: string;
  href: string;
  disabled: boolean;
}
const props = withDefaults(
  defineProps<{ title?: string; current?: string; goBack: boolean }>(),
  { goBack: false },
);
const route = useRoute();
const { back } = useRouter();
const pathArray = route.fullPath.split('/').slice(1);
/*
  FIXME: For some reason, the previous metadata is getting lost, 
  so i can't access the first breadcrumb value.
*/
const crumbs = computed(() =>
  pathArray.reduce<breadcrumb[]>((breadcrumbArray, path, index) => {
    breadcrumbArray.push({
      title:
        props.current && index === pathArray.length - 1
          ? props.current
          : (route.matched[index].meta.title as string) || path,
      href: breadcrumbArray[index - 1]
        ? breadcrumbArray[index - 1].href + '/' + path
        : '/' + path,
      disabled: index == pathArray.length - 1,
    });

    return breadcrumbArray;
  }, []),
);

const firstTitle = computed(() => route.matched[0].meta.breadcrumbTitle);
</script>

<style scoped lang="scss">
.breadcrumbs-item {
  text-decoration: none !important;
  &:hover {
    color: rgb(var(--v-theme-secondary-0)) !important;
    text-decoration: none !important;
  }
}
</style>
