<template>
  <v-dialog v-model="visible" width="95%">
    <v-card>
      <v-card-title>
        {{ isLoading ? $t('defaultLayout.isLoading') : title }}
      </v-card-title>
      <div ref="contentContainer" class="content-container pa-10"></div>
      <v-skeleton-loader
        v-if="isLoading"
        class="mx-auto"
        max-width="100%"
        type="card"
      />
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const i18n = useI18n();

const messageStore = useMessageStore();
const props = defineProps({
  url: {
    default: '',
    type: String,
  },
});
const { url } = toRefs(props);

const isLoading = ref(false);
const visible = ref(false);
const title = ref('');
const contentContainer = ref();

const handleModal = (value) => {
  visible.value = value;
};

const parsePage = async () => {
  isLoading.value = true;
  try {
    const res: any = await $fetch(`/api/parse-url`, {
      method: 'POST',
      body: JSON.stringify({
        url: url.value,
      }),
    });
    if (res.data.error) {
      messageStore.message = i18n.t('articleViewer.processingError');
      messageStore.color = 'red';
      messageStore.show = true;
    }
    contentContainer.value.innerHTML = res.data.content;
    title.value = res.data.title;
  } catch (error) {
    messageStore.message = i18n.t('articleViewer.processingError');
    messageStore.color = 'red';
    messageStore.show = true;
  }
  isLoading.value = false;
};
</script>
<style>
.content-container img {
  max-width: 100% !important;
}
</style>
