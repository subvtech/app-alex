<template>
  <alex-custom-dialog
    v-model="dialog"
    :title="$t('components.profile.socials.title')"
    :name-main-button="$t('components.profile.settings.onSave')"
    :name-second-button="$t('components.profile.settings.cancel')"
    :main-button-disabled="mainButtonDisabled"
    @on-main-action="onSave"
    @on-secondary-action="dialog = false"
  >
    <template #activator="{ props: propsActivator }">
      <alex-custom-button
        v-bind="propsActivator"
        prepend-icon="mdi-plus"
        @click="dialog = true"
      >
        {{ $t('components.profile.general.addSocial') }}
      </alex-custom-button>
    </template>
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
          <img
            v-if="item.raw === 'Youtube'"
            class="mr-4 icon-size"
            src="/svg/youtube.svg"
          />
          <img
            v-else-if="item.raw === 'Linkedin'"
            class="mr-4 icon-size"
            src="/svg/linkedin.svg"
          />
          <img
            v-else-if="item.raw === 'Instagram'"
            class="mr-4 icon-size"
            src="/svg/instagram.svg"
          />

          <img v-else class="mr-4 icon-size" src="/svg/website.svg" />
          <p class="selected-item">{{ item.raw }}</p>
        </template>

        <template #item="{ item, props: itemProps }">
          <v-list-item class="item-option" v-bind="itemProps">
            <template #prepend>
              <img
                v-if="item.raw === 'Youtube'"
                class="mr-4 icon-size"
                src="/svg/youtube.svg"
              />
              <img
                v-else-if="item.raw === 'Linkedin'"
                class="mr-4 icon-size"
                src="/svg/linkedin.svg"
              />
              <img
                v-else-if="item.raw === 'Instagram'"
                class="mr-4 icon-size"
                src="/svg/instagram.svg"
              />

              <img v-else class="mr-4 icon-size" src="/svg/website.svg" />
            </template>
          </v-list-item> </template
      ></alex-inputs-select>
      <div
        v-if="selectedSocial"
        class="d-flex align-center w-100 gap-4"
        style=""
      >
        <alex-inputs-text-field
          v-model="urlField.value.value"
          class="w-100"
          :label="$t('components.profile.socials.editForm.url.label')"
          :placeholder="
            $t('components.profile.socials.editForm.url.placeholder')
          "
          name="addurl"
          required
          :error-messages="urlField.errorMessage.value"
        />

        <alex-inputs-text-field
          v-if="nonSupportedSocialMedia"
          v-model="nameField.value.value"
          class="w-100"
          :label="$t('components.profile.socials.editForm.name.label')"
          :placeholder="
            $t('components.profile.socials.editForm.name.placeholder')
          "
          name="addname"
          required
          :error-messages="nameField.errorMessage.value"
        />
      </div>
    </div>
  </alex-custom-dialog>
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

const nameField = useField('addname', nameRules, {
  initialValue: '',
});

const urlField = useField('addurl', urlRules, {
  initialValue: '',
});

const onSave = () => {
  if (!selectedSocial.value) return;
  emit('save:social', {
    name: nameField.value.value,
    url: urlField.value.value,
    selectedSocial: selectedSocial.value,
  });
  selectedSocial.value = null;
  urlField.value.value = '';
  nameField.value.value = '';
  dialog.value = false;
};

const nonSupportedSocialMedia = computed(
  () =>
    selectedSocial.value === i18n.t('components.profile.socials.otherSocial'),
);

const mainButtonDisabled = computed(() => {
  return (
    !!nameField.errorMessage?.value ||
    !!urlField.errorMessage?.value ||
    !urlField.value.value ||
    !selectedSocial.value ||
    (nonSupportedSocialMedia.value && !nameField.value.value)
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
