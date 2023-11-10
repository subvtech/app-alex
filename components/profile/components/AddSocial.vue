<template>
  <div id="Card" class="d-flex flex-column">
    <div
      class="d-flex align-center justify-space-between px-6"
      style="border-bottom: 1px solid #eaeef1"
    >
      <div class="foretitle d-flex py-6">
        <span>{{ $t('components.profile.socials.title') }}</span>
      </div>

      <div @click="emit('close:addSocial')" style="cursor: pointer">
        <v-icon color="#6E7A87">mdi-close</v-icon>
      </div>
    </div>

    <div class="pt-6 pb-1">
      <div class="d-flex flex-column px-6" style="gap: 8px">
        <span>{{ $t('components.profile.socials.addSocial') }}</span>

        <v-select
          label=""
          :items="socials"
          menu
          variant="outlined"
          v-model="selectedSocial"
        >
          <template #selection="{ item }">
            <NuxtImg
              class="mr-4"
              :src="
                ['Youtube', 'Linkedin', 'Instagram'].includes(item.raw)
                  ? `/svg/${item.raw}.svg`
                  : '/svg/website.svg'
              "
              placeholder
              style="width: 24px; height: 24px"
            />
            <p4 style="color: #6e7a87">{{ item.raw }}</p4>
          </template>

          <template #item="{ item, props }">
            <v-list-item
              v-bind="props"
              style="
                color: #6e7a87;
                /* Body/P4 */
                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: 135%; /* 18.9px */
                letter-spacing: 0.28px;
              "
              v-slot:prepend=""
            >
              <NuxtImg
                class="mr-4"
                :src="
                  ['Youtube', 'Linkedin', 'Instagram'].includes(item.raw)
                    ? `/svg/${item.raw}.svg`
                    : '/svg/website.svg'
                "
                placeholder
                style="width: 24px; height: 24px"
              />
            </v-list-item> </template
        ></v-select>
      </div>
      <div v-if="selectedSocial" class="form d-flex align-center px-6" style="">
        <div class="d-flex flex-column w-100" style="gap: 8px">
          <span>{{ $t('components.profile.socials.editSocialUrl') }}</span>

          <v-text-field
            v-model="value"
            name="url"
            :error-messages="errorMessage"
            color="black"
            variant="outlined"
          />
        </div>

        <div
          v-if="selectedSocial === $t('components.profile.socials.otherSocial')"
          class="d-flex flex-column w-100"
          style="gap: 8px"
        >
          <span>{{ $t('components.profile.socials.editSocialName') }}</span>

          <v-text-field
            v-model="value2"
            name="name"
            :error-messages="errorMessage2"
            color="black"
            variant="outlined"
          />
        </div>
      </div>
    </div>

    <div
      class="d-flex justify-end px-6 py-4"
      style="gap: 8px; border-top: 1px solid #ebedef"
    >
      <v-btn
        class="btn px-3"
        color="accent"
        @click="emit('close:addSocial')"
        variant="outlined"
      >
        {{ $t('components.profile.settings.cancel') }}</v-btn
      >
      <v-btn
        class="btn px-3"
        color="accent"
        :disabled="
          errorMessage ||
          (selectedSocial === $t('components.profile.socials.otherSocial') &&
            (errorMessage2 || value2 === '')) ||
          value === ''
            ? true
            : false
        "
        @click="emit('save:addSocial', { selectedSocial, value, value2 })"
        type="submit"
      >
        {{ $t('components.profile.settings.save') }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
const { nameRules, urlRules } = useFormRules();

const emit = defineEmits(['close:addSocial', 'save:addSocial']);

const props = defineProps({
  socials: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const { socials } = toRefs(props);

const selectedSocial = ref<string | null>(null);
const { value, errorMessage } = useField('url', urlRules, {
  initialValue: '',
});

const { value: value2, errorMessage: errorMessage2 } = useField(
  'name',
  nameRules,
  {
    initialValue: '',
  },
);
</script>

<style scoped lang="scss">
#Card {
  background-color: white;
  font-family: Sen;
  border-radius: 8px;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);
  width: 33%;

  .foretitle {
    align-items: center;
    align-self: stretch;

    span {
      color: #5d6872;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
    }
  }
  .btn {
    text-transform: none !important;
    height: 36px;
  }
}

@media (max-width: 1350px) {
  #Card {
    .form {
      flex-direction: column;
    }
  }
}
@media (max-width: 800px) {
  #Card {
    width: 50%;
  }
}

@media (max-width: 600px) {
  #Card {
    width: 66%;
  }
}

@media (max-width: 500px) {
  #Card {
    width: 80%;
    min-width: 280px;
  }
}
</style>
