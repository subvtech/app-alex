<template>
  <alex-custom-card
    :title="$t(`components.${namespace}.settings.cover.title`)"
    :show-icon="false"
    show-footer-divider
  >
    <template #content>
      <alex-custom-banner
        :cover-picture="uploadCover"
        :img-from-strapi="theresCover"
      />
    </template>
    <template #footer>
      <div class="d-flex flex-wrap justify-end w-100 gap-3 pt-6">
        <label class="" for="coverInput" data-testid="edit-cover">
          <alex-custom-button
            prepend-icon="mdi-cloud-upload-outline"
            variant="secondary"
            @click="($refs.fileInput as any).click()"
            >Fazer upload</alex-custom-button
          >
        </label>
        <alex-custom-button
          v-if="theresCover"
          icon="mdi-trash-can-outline"
          variant="error"
          @click="deleteCover"
        />
        <input
          class="d-none"
          @input="(e) => emit('update', e)"
          accept="image/png, image/jpeg"
          ref="fileInput"
          type="file"
        />
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { BannerImageType } from '@/components/alex/custom/Banner.vue';

const i18n = useI18n();

const emit = defineEmits(['update', 'delete']);

const props = defineProps({
  cover: {
    type: Object as PropType<BannerImageType>,
    default: {
      id: -1,
      url: '/images/emptyBanner.svg',
    },
  },
  learningPlanId: {
    type: Number,
    required: true,
  },
  namespace: {
    type: String as PropType<'courses' | 'trails'>,
    default: 'courses',
  },
});

const { cover } = toRefs(props);

const uploadCover = ref(props.cover);

const emptyState = {
  id: -1,
  url: '/images/emptyBanner.svg',
};

const theresCover = computed(() => uploadCover.value.id !== emptyState.id);

const deleteCover = () => {
  if (!theresCover.value) return;
  emit('delete');
};

watch(cover!, () => {
  uploadCover.value = props.cover;
});
</script>
