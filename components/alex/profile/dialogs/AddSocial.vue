<template>
  <alex-custom-button prepend-icon="mdi-plus" @click="dialog = true">
    {{ $t('components.profile.general.addSocial') }}
    <alex-custom-dialog
      v-model="dialog"
      :title="$t('components.profile.socials.title')"
      :name-main-button="$t('components.profile.settings.onSave')"
      :name-second-button="$t('components.profile.settings.cancel')"
      :main-button-disabled="mainButtonDisabled"
      @on-main-action="onSave"
      @on-secondary-action="dialog = false"
    >
      <div class="d-flex flex-column pt-6 px-6 pb-1">
        <alex-inputs-select
          v-model="selectedSocial"
          class="pb-6"
          name="social"
          :items="formattedSocials"
          :placeholder="$t('components.profile.socials.addDialog.placeholder')"
          persistent-hint
          required
          :label="$t('components.profile.socials.addDialog.label')"
        >
          <template #selection="{ item }">
            <img class="mr-4 icon-size" :src="getIcon(item.raw)" />
            <p class="selected-item">{{ item.raw }}</p>
          </template>

          <template #item="{ item, props: itemProps }">
            <v-list-item class="item-option" v-bind="itemProps">
              <img class="mr-4 icon-size" :src="getIcon(item.raw)" />
            </v-list-item> </template
        ></alex-inputs-select>
        <div
          v-if="selectedSocial"
          class="d-flex align-center w-100 gap-4"
          style=""
        >
          <alex-inputs-text-field
            v-model="urlValue"
            class="w-100"
            :label="$t('components.profile.socials.editForm.url.label')"
            :placeholder="
              $t('components.profile.socials.editForm.url.placeholder')
            "
            name="addurl"
            required
            :error-messages="urlErrorMessage"
          />

          <alex-inputs-text-field
            v-if="nonSupportedSocialMedia"
            v-model="nameValue"
            class="w-100"
            :label="$t('components.profile.socials.editForm.name.label')"
            :placeholder="
              $t('components.profile.socials.editForm.name.placeholder')
            "
            name="addname"
            required
            :error-messages="nameErrorMessage"
          />
        </div>
      </div>
    </alex-custom-dialog>
  </alex-custom-button>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';

export interface AddSocialComponentType {
  socials: string[];
}

export interface SocialDialogSavePayload {
  name: string;
  url: string;
  selectedSocial: string;
}
export interface AddSocialEmits {
  (e: 'save:social', value: SocialDialogSavePayload): void;
}

const i18n = useI18n();
const emit = defineEmits<AddSocialEmits>();

const props = withDefaults(defineProps<AddSocialComponentType>(), {});

const { nameRules, urlRules } = useFormRules();

const formattedSocials = computed(() =>
  props.socials.map(
    (item) => item.charAt(0).toUpperCase() + item.toLowerCase().slice(1),
  ),
);
const selectedSocial = ref<string | null>(null);
const dialog = ref(false);

const { value: nameValue, errorMessage: nameErrorMessage } = useField(
  'addname',
  nameRules,
  {
    initialValue: '',
  },
);

const { value: urlValue, errorMessage: urlErrorMessage } = useField(
  'addurl',
  urlRules,
  {
    initialValue: '',
  },
);

const onSave = () => {
  if (!selectedSocial.value) return;
  emit('save:social', {
    name: nameValue.value,
    url: urlValue.value,
    selectedSocial: selectedSocial.value,
  });
  selectedSocial.value = null;
  urlValue.value = '';
  nameValue.value = '';
  dialog.value = false;
};

const supported = ['Youtube', 'Linkedin', 'Instagram'];
const getIcon = (name) =>
  supported.includes(name) ? `/svg/${name}.svg` : '/svg/website.svg';

const nonSupportedSocialMedia = computed(
  () =>
    selectedSocial.value === i18n.t('components.profile.socials.otherSocial'),
);

const mainButtonDisabled = computed(() => {
  return (
    !!nameErrorMessage?.value ||
    !!urlErrorMessage?.value ||
    !selectedSocial.value ||
    nonSupportedSocialMedia.value ||
    !urlValue.value
  );
});
</script>

<style scoped lang="scss">
.icon-size {
  width: 24px;
  height: 24px;
}

.selected-item {
  color: var(--Cinza-Cinza-600, #6e7a87);
  /* Body/P4 */
  font-family: Sen;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}

.item-option {
  color: #6e7a87;
  /* Body/P4 */
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}
</style>
