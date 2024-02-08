<template>
  <div class="content-area">
    <div class="card-title">
      <p>
        <span class="text-h4 text-gray-800">{{
          $t(`components.${namespace}.settings.cover.title`)
        }}</span>
      </p>
    </div>
    <div class="cover-content-body">
      <div
        v-if="trailStore.trail.cover_image != null"
        class="filePreview"
        :style="{
          backgroundImage: 'url(' + trailStore.trail.cover_image.url + ')',
        }"
      >
        <alex-custom-button
          aria-label="delete"
          elevation="0"
          icon="mdi-trash-can-outline"
          variant="error"
          class="position-absolute btn"
          @click="removeCoverImage()"
        />
      </div>
      <div
        v-else-if="image"
        class="filePreview"
        :style="{
          backgroundImage: 'url(' + image + ')',
        }"
      >
        <alex-custom-button
          aria-label="delete"
          elevation="0"
          icon="mdi-trash-can-outline"
          variant="error"
          class="position-absolute btn"
          @click="removeCoverImage()"
        />
      </div>
      <div
        v-else
        class="empty-state mb-4"
        :style="{
          backgroundImage: 'url(' + emptyState.url + ')',
        }"
      ></div>
      <span class="action-content">
        <alex-custom-button
          class="button"
          prepend-icon="mdi-cloud-upload-outline"
          variant="secondary"
          @click="fileInputRef.click()"
          >{{
            $t(`components.${namespace}.settings.cover.addCover`)
          }}</alex-custom-button
        >
        <input
          ref="fileInputRef"
          type="file"
          accept=".jpeg, .png, .wav, .mp4, .jpg"
          class="d-none"
          @change="handleFileChange()"
        />
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { trail } from '~/assets/queries';

defineProps({
  namespace: {
    type: String as PropType<'courses' | 'trails'>,
    default: 'courses',
  },
});

const emptyState = {
  id: -1,
  url: '/images/emptyBanner.svg',
};

const route = useRoute();
const { update } = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();
const strapiClient = useStrapiClient();
const { trailId } = route.params;
const trailStore = useTrailStore();
const emit = defineEmits(['update']);

const removeCoverImage = () => {
  try {
    image.value = null;
    trailStore.trail.cover_image = null;
    update(`trails/${trailId}`, {
      cover_image: null,
    });
    emit('update');
    setMessage(
      t('components.trails.settings.cover.removeSuccess'),
      'green',
      true,
    );
  } catch (error) {
    setMessage(t('components.trails.settings.cover.removeError'), 'red', true);
  }
};

const fileInputRef = ref(null);
const image = ref(null);

const handleFileChange = () => {
  const fileInput = fileInputRef.value;
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      image.value = reader.result;
    };
    reader.readAsDataURL(file);
    handleSubmit();
  }
};

const handleSubmit = async () => {
  const uploadImage = fileInputRef.value.files[0];
  const formData = new FormData();
  formData.append('files.cover_image', uploadImage);
  formData.append('data', JSON.stringify({}));
  try {
    if (uploadImage) {
      await strapiClient(`trails/${trailId}`, {
        method: 'PUT',
        body: formData,
      });
    }
    setMessage(t('components.trails.settings.cover.update'), 'green', true);
    emit('update');
  } catch (error) {
    setMessage(t('components.trails.settings.cover.error'), 'red', true);
  }
};
</script>
<style scoped lang="scss">
p {
  color: var(--cinza-cinza-400, #a0a8b1);
  text-align: center;
  font-family: Sen;
}
.container {
  display: flex;
}

.btn {
  top: 16px;
  right: 16px;
}

.empty-state {
  display: flex;
  height: 250px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--cinza-cinza-100, #ebedef);
  background: var(--cinza-cinza-azulado, #f1f5f9);
  background-size: cover;
  background-position: center;
}

.filePreview {
  display: flex;
  position: relative;
  height: 250px;
  padding: 5.072px;
  align-items: center;
  margin-bottom: 16px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--cinza-cinza-100, #ebedef);
  background-size: cover;
  background-position: center;
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
  align-self: stretch;
}

.content-area {
  display: flex;
  max-width: 850px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px !important;
  border: 1px solid var(--cinza-cinza-200, #d2d6da) !important;
  background: var(--principais-branco, #fff);
  margin-top: 24px;
}

.content-body {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}

.cover-content-body {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
}

.card-title {
  display: flex;
  height: 72px;
  padding: 16px 18px 16px 24px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}
.footer-content {
  display: flex;
  padding: 0 24px;
  justify-content: flex-end;
  align-items: center !important;
  gap: 16px;
  align-self: stretch;
  border-top: 1px solid var(--cinza-cinza-100, #ebedef);
}

.border-bottom {
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}

.button.error {
  color: var(--principais-branco, #fff) !important;
}
</style>
