<template>
  <div class="content-area">
    <div class="card-title">
      <p>
        <span class="header-h4">{{
          $t('components.trails.settings.general.title')
        }}</span>
      </p>
    </div>
    <div class="d-flex flex-column w-100 content-body">
      <alex-inputs-text-field
        v-model="name"
        :label="$t('components.trails.settings.general.trailTitle')"
        name="title"
        class="w-100"
        density="comfortable"
        required
      />
      <alex-inputs-text-area
        v-model="description"
        :label="$t('components.trails.settings.general.description')"
        name="description"
        class="w-100"
        density="comfortable"
        required
      />
    </div>
    <div class="footer-content">
      <span class="action-content-two">
        <alex-custom-button
          class="button"
          variant="secondary"
          @click="onCancel()"
          >{{
            $t('components.trails.settings.general.cancel')
          }}</alex-custom-button
        >
        <alex-custom-button
          class="button"
          variant="primary"
          @click="handleUpdate()"
          >{{
            $t('components.trails.settings.general.save')
          }}</alex-custom-button
        >
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
const trailStore = useTrailStore();

const emit = defineEmits(['update']);

const { generalTrailSchema } = useFormRules();

const { errors } = useForm({
  validationSchema: generalTrailSchema,
  keepValuesOnUnmount: true,
});

const name = ref('');
const description = ref('');

const onCancel = () => {
  name.value = trailStore.trail.title;
  description.value = trailStore.trail.description;
};

const theresError = computed(() => Object.keys(errors.value).length !== 0);

const handleUpdate = () => {
  emit('update', name.value, description.value);
};

watch(
  () => trailStore.trail,
  (trail) => {
    name.value = trail.title;
    description.value = trail.description;
  },
  { immediate: true },
);
</script>
<style scoped lang="scss">
.header-h4 {
  color: var(--cinza-cinza-800, #454d54);
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.2px;
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
  padding: 24px 24px 8px 24px;
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
.action-content-two {
  display: flex;
  height: 76px;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}
.border-bottom {
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}
</style>
