<template>
  <node-view-wrapper class="mt-1">
    <alex-inputs-text-field
      v-if="!readOnly && !urlData.title"
      v-model="url"
      class="mx-auto tw-w-100"
      name="url"
      prepend-inner-icon="mdi-link"
      density="comfortable"
      :readonly="isLoading || readOnly"
      :error="fetchError"
      :placeholder="t('components.tiptap.bookmark.placeholder')"
      :error-messages="fetchError ? t('components.tiptap.bookmark.error') : ''"
      @keydown.enter.stop="fetchData"
      @paste="fetchData($event.clipboardData.getData('text'))"
      @input="updateAttributes({ url })"
    >
      <template #append-inner>
        <alex-custom-button variant="text" :loading="isLoading" icon="mdi-send" color="gray-600" @click="fetchData" />
      </template>
    </alex-inputs-text-field>
    <nuxt-link
      v-else-if="urlData.title"
      :href="url"
      target="_blank"
      class="mx-auto tw-w-100 sm:tw-w-[80%] d-flex rounded-lg pa-3 pa-sm-5 text-break bookmark text-decoration-none"
    >
      <div class="w-100">
        <p class="text-h5 text-gray-800 ellipsis lines-3">
          {{ urlData.title }}
        </p>
        <p class="my-4 ellipsis lines-2 text-gray-600">
          {{ urlData.description }}
        </p>
        <p class="text-decoration tw-text-gray-400">{{ urlData.domain }}</p>
      </div>
      <v-img v-if="urlData.image?.url" :src="urlData.image.url" class="tw-w-4/5 ml-3 rounded-lg" max-width="30%" />
    </nuxt-link>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, NodeViewProps } from '@tiptap/vue-3';

interface urlRes {
  title: string;
  domain: string;
  description: string;
  image?: {
    url: string;
  };
}

const { t } = useI18n();

const props = defineProps({
  node: {
    type: Object as PropType<NodeViewProps['node']>,
    required: true,
  },
  extension: {
    type: Object as PropType<NodeViewProps['extension']>,
    required: true,
  },
  updateAttributes: {
    type: Function as PropType<NodeViewProps['updateAttributes']>,
    default: () => {},
  },
});

const isLoading = ref(false);
const fetchError = ref(false);

const url = ref<string>(props.node.attrs.url);

const urlData = ref<urlRes>(props.node.attrs.meta);

const readOnly = computed(() => props.extension.options.readOnly());

watch(
  () => props.node.attrs.url,
  (value) => {
    url.value = value;
  },
);

watch(
  () => props.node.attrs.meta,
  (value) => {
    urlData.value = value;
  },
);

const fetchData = async (pasteUrl: string) => {
  const fetchUrl = pasteUrl || url.value;
  if (!fetchUrl || isLoading.value) return;
  const endpoint = props.extension.options.endpoint;
  isLoading.value = true;
  fetchError.value = false;
  try {
    const response = await fetch(`${endpoint}?url=${fetchUrl}`);
    const res = await response.json();
    if (res.success) {
      urlData.value = res.meta;
      props.updateAttributes({
        url: fetchUrl,
        meta: urlData.value,
      });
    } else {
      throw new Error('Invalid URL');
    }
  } catch (error) {
    fetchError.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.bookmark {
  box-shadow: 0 1px 3px #0000001a;
  border: 1px solid rgb(var(--v-theme-gray-300));
  &:hover {
    box-shadow: 0 1px 5px #0000001a;
  }
}
</style>
