<template>
  <div id="events" class="w-100 d-flex overflow-x-hidden">
    <alex-custom-card
      :title="$t('components.profile.events.title')"
      :full-width="true"
    >
      <template v-slot:content>
        <div class="items d-flex flex-column">
          <div
            class="item d-flex flex-row align-center py-3 px-4"
            v-if="props.url"
            v-for="item in [
              {
                username: username,
                action: $t('components.profile.events.add'),
                time: '11:30 AM',
              },
              {
                username: username,
                action: $t('components.profile.events.add'),
                time: '11:30 AM',
              },
            ]"
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
definePageMeta({
  middleware: 'auth',
});
const props = defineProps({
  url: {
    type: String,
  },
});

const userStore = useUserStore();

const {
  email,
  phone,
  id,
  cpf,
  username,
  fullname,
  avatar,
  cover,
  isProfessor,
  socials,
  institutions,
  tags,
  info,
  canEdit,
} = toRefs(userStore);
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
