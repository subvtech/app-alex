<template>
  <div v-if="user" id="events" class="w-100 d-flex overflow-x-hidden">
    <alex-custom-card :title="$t('components.profile.events.title')" full-width>
      <template #content>
        <div v-if="props.url" class="items d-flex flex-column">
          <div
            v-for="(item, index) in data"
            :key="index"
            class="item d-flex flex-row align-center py-3 px-4"
          >
            <img v-if="props.url" :src="props.url" :alt="item.username" />
            <div class="">
              <span>{{ item.username + ' ' + item.action }}</span>
              <p>{{ item.time }}</p>
            </div>
          </div>
        </div>
      </template>
    </alex-custom-card>
  </div>
</template>

<script setup lang="ts">
export interface EventsComponentType {
  url?: string;
}

definePageMeta({
  middleware: 'auth',
});
const props = withDefaults(defineProps<EventsComponentType>(), {
  url: undefined,
});

const i18n = useI18n();

const { user } = useUserStore();

const data = computed(() => {
  if (!user) return [];
  return [
    {
      username: user.username,
      action: i18n.t('components.profile.events.add'),
      time: '11:30 AM',
    },
    {
      username: user.username,
      action: i18n.t('components.profile.events.add'),
      time: '11:30 AM',
    },
  ];
});
</script>

<style scoped lang="scss">
.items {
  gap: 16px;
  .item {
    border-radius: 8px;
    background-color: #f1f5f9;

    img {
      max-width: 40px;
      max-height: 40px;

      aspect-ratio: 1 / 1; /* defining the aspect ratio of the image */
      object-fit: cover;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: solid #fff;
      border-radius: 100%;
    }
  }
}
</style>
