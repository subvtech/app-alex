<template>
  <alex-custom-card
    :title="$t('components.courses.settings.cover.title')"
    :show-icon="false"
    class="content-area"
  >
    <template #content>
      <alex-custom-banner
        :cover-picture="uploadCover"
        :img-from-strapi="theresCover"
        class="banner"
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
          @click="removeCoverPicture"
        />
        <input
          class="d-none"
          @input="uploadCoverPicture"
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

const { find, update } = useStrapi();
const { uploadImage, removeImage } = useUploadedImage();
const i18n = useI18n();

const emit = defineEmits(['update']);

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
});

const { cover } = toRefs(props);

const uploadCover = ref(props.cover);

const emptyState = {
  id: -1,
  url: '/images/emptyBanner.svg',
};

async function uploadCoverPicture(event: any) {
  const temp = await uploadImage(event);
  uploadCover.value = { url: temp[0].url, id: temp[0].id };

  await update(`/learningplans/${props.learningPlanId}`, {
    cover_image: uploadCover.value.id,
  });
  emit('update', i18n.t('components.courses.settings.cover.update'));
}

async function removeCoverPicture() {
  if (!theresCover.value) return;
  await removeImage(uploadCover.value.id);
  uploadCover.value = emptyState;
  emit('update', i18n.t('components.courses.settings.cover.update'));
}

const theresCover = computed(() => uploadCover.value.id !== emptyState.id);

watch(cover!, () => {
  uploadCover.value = props.cover;
});
</script>
<style scoped lang="scss">
.content-area {
  border: 1px solid var(--cinza-cinza-200, #d2d6da) !important;
  box-shadow: none !important;
}

.banner {
  border-radius: 8px;
  border: 1px solid var(--Cinza-Cinza-100, #ebedef);
  box-shadow: none !important;
}
</style>
