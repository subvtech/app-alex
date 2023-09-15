<template>
  <profile-card
    class="mt-6"
    :title="$t('components.profile.socials.title')"
    :full-width="true"
  >
    <template v-slot:content>
      <v-form
        class="d-flex flex-column w-100 align-center"
        style="gap: 24px"
        @submit.prevent="updateValues"
      >
        <div
          class="item d-flex flex-row align-start w-100"
          v-for="(social, index) in socials"
        >
          <img :src="strapiBaseUrl + social.icon.url" :alt="social.name" />

          <div class="d-flex flex-column w-100" style="gap: 8px">
            <alex-inputs-stepper-field
              :label="social.name"
              :value="social.name"
              :name="`name.${index}`"
              class=""
              color="black"
              variant="outlined"
            />
            <alex-inputs-stepper-field
              label="url"
              :value="social.url"
              :name="`url.${index}`"
              class=""
              color="black"
              variant="outlined"
            />
          </div>
        </div>
        <div class="item d-flex flex-row align-start w-100">
          <img src="../../assets/svg/website.svg" alt="icon" />

          <div class="d-flex flex-column w-100" style="gap: 8px">
            <alex-inputs-stepper-field
              :label="$t('components.profile.socials.newSocial')"
              name="nameLoose"
              class=""
              color="black"
              variant="outlined"
            />
            <alex-inputs-stepper-field
              :label="$t('components.profile.socials.newSocialUrl')"
              name="urlLoose"
              class=""
              color="black"
              variant="outlined"
            />
          </div>
        </div>
        <div class="d-flex justify-end">
          <v-btn class="btn" color="accent" @click="cancel" variant="outlined">
            {{ $t('components.profile.settings.cancel') }}</v-btn
          >
          <v-btn class="btn ml-2" color="accent" type="submit">
            {{ $t('components.profile.settings.save') }}
          </v-btn>
        </div>
      </v-form>
    </template>
  </profile-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';

const strapiBaseUrl = computed(() => useStrapiUrl().replace('/api', ''));

const emit = defineEmits(['update:user']);
const { socialsSchema } = useFormRules();

const { create, update } = useStrapi();

const messageStore = useMessageStore();
const loading = ref(false);

type Social = {
  name: string;
  url: string;
  icon: any;
  id: number;
};

const props = defineProps({
  socials: {
    type: Array as PropType<Social[]>,
    required: true,
  },

  id: {
    type: Number,
    required: true,
  },
});

const { socials } = toRefs(props);

const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema: socialsSchema,
  keepValuesOnUnmount: true,
});

const cancel = () => {
  socials.value = props.socials;
};

const updateValues = handleSubmit(async () => {
  loading.value = true;
  console.log({ controlledValues: controlledValues.value });
  console.log({ values: values.value });
  try {
    const promises: any = [];
    props.socials.forEach((social, index) => {
      promises.push(
        update('socials', social.id, {
          name: controlledValues.value.name[index],
          url: controlledValues.value.url[index],
        }),
      );
    });
    if (controlledValues.value.nameLoose && controlledValues.value.urlLoose)
      promises.push(
        create('socials', {
          name: controlledValues.value.nameLoose,
          url: controlledValues.value.urlLoose,
        }),
      );

    await Promise.all(promises);

    emit('update:user', {});
  } catch (error) {
    console.log(error);
    messageStore.message = error as string;
    messageStore.color = 'red';
    messageStore.show = true;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
.item {
  gap: 24px;
  img {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
}
</style>
