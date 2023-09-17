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
          <div class="img-upload">
            <label class="edit" :for="'file-input-' + social.name">
              <img :src="strapiBaseUrl + social.icon.url" :alt="social.name" />
            </label>

            <input
              class=""
              style="display: none"
              @input="async (e) => await updateSocialIcon(e, social.id, index)"
              :id="'file-input-' + social.name"
              type="file"
              accept="image/png, image/jpeg, image/svg"
            />
          </div>

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
          <div class="img-upload">
            <label class="edit" for="new-icon">
              <img v-if="newIcon" :src="newIcon" alt="icon" />
              <img v-else src="../../assets/svg/website.svg" alt="icon" />
            </label>

            <input
              class=""
              @input="uploadNewIcon"
              style="display: none"
              id="new-icon"
              type="file"
              accept="image/png, image/jpeg, image/svg"
            />
          </div>

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
        <div class="block d-flex justify-end">
          <v-btn class="btn" color="accent" @click="cancel" variant="outlined">
            {{ $t('components.profile.settings.cancel') }}</v-btn
          >
          <v-btn class="btn" color="accent" type="submit">
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
const client = useStrapiClient();
const { updateImage } = useUploadedImage();
const messageStore = useMessageStore();
const loading = ref(false);

const newIcon = ref<string | null>(null);

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
    if (
      controlledValues.value.nameLoose &&
      controlledValues.value.urlLoose &&
      newIcon.value
    ) {
      const formData = new FormData();
      const response = await fetch(newIcon.value!);
      const mimeType = response.headers.get('Content-Type');
      const fileData = new File([await response.blob()], 'icon', {
        type: mimeType!,
      });

      formData.append('files', fileData);

      promises.push(
        client<any>('/upload', {
          method: 'POST',
          body: formData,
        })
          .then((result) => {
            create('socials', {
              icon: result[0].id,
              name: controlledValues.value.nameLoose,
              url: controlledValues.value.urlLoose,
              users_permissions_user: props.id,
            })
              .then((result2) => {})
              .catch((err) => {
                console.log(err);
              });
          })
          .then((err) => {
            console.log(err);
          }),
      );
    }

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

async function updateSocialIcon(event: any, iconId: number, index: number) {
  const { updatedAt } = await updateImage(event, iconId);
  const url = socials.value[index].icon.url.split('?');
  if (url) socials.value[index].icon.url = url[0] + '?' + updatedAt;
}

async function uploadNewIcon(e: any) {
  newIcon.value = URL.createObjectURL(e.target.files[0]);

  //const { updatedAt } = await updateImage(event, user.value.avatar.id);
}
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

.block {
  gap: 8px;
}

@media (max-width: 400px) {
  .block {
    gap: 12px;
    flex-direction: column-reverse;
    width: 100%;
    .btn {
      width: 100%;
    }
  }
}
</style>
