<template>
  <v-form
    @submit.prevent="updateValues"
    ref="form"
    class="d-flex flex-row align-center justify-space-between w-100"
    style="gap: 16px"
  >
    <div class="contact-item d-flex flex-col align-center w-100">
      <div class="img-upload pa-1">
        <label
          class="edit d-flex align-center"
          :for="isEditing || isAdding ? `new-icon-${social.id}` : ''"
        >
          <img
            v-if="newIcon"
            class="icon upload"
            :src="newIcon"
            :alt="social.name"
          />
          <img
            v-else-if="isAdding"
            class="icon upload"
            src="../../../assets/svg/website.svg"
            :alt="social.name"
          />
          <img
            v-else
            class="icon"
            :class="isEditing ? 'upload' : ''"
            :src="newIcon ? newIcon : strapiBaseUrl + social.icon.url"
            :alt="social.name"
          />
        </label>
        <input
          v-if="isEditing || isAdding"
          @input="(e) => uploadNewIcon(e)"
          style="display: none"
          :id="`new-icon-${social.id}`"
          type="file"
          accept="image/png, image/jpeg, image/svg"
        />
      </div>

      <div
        v-if="isEditing || isAdding"
        class="d-flex flex-column w-100 mb-16"
        style="gap: 24px"
      >
        <alex-inputs-stepper-field
          :label="label1 ? label1 : social.name"
          name="name"
          :value="social.name"
          color="black"
          variant="outlined"
        />
        <alex-inputs-stepper-field
          :label="label2 ? label2 : social.url"
          name="url"
          :value="social.url"
          color="black"
          variant="outlined"
        />
      </div>

      <div v-else class="d-flex align-center">
        <div class="d-flex flex-column justify-center align-center field">
          <a :href="social.url" target="_blank">
            {{ social.name.toUpperCase() }}
          </a>
        </div>
      </div>
    </div>

    <div
      v-if="canEdit"
      class="d-flex align-center"
      style="cursor: pointer; gap: 8px"
    >
      <button
        v-if="isEditing || isAdding"
        type="submit"
        style="border-width: 0px"
      >
        <v-icon size="small" color="#6E7A87">mdi-check</v-icon>
      </button>

      <v-icon v-else @click="isEditing = true" size="small" color="#6E7A87"
        >mdi-pencil-outline</v-icon
      >
      <v-icon
        v-if="isAdding"
        @click="emit('close:addSocial')"
        style="cursor: pointer"
        size="small"
        color="#E9494A"
        >mdi-close</v-icon
      >

      <v-icon
        v-else
        @click="deleteSocial"
        style="cursor: pointer"
        size="small"
        color="#E9494A"
        >mdi-trash-can-outline</v-icon
      >
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';

const strapiBaseUrl = computed(() => useStrapiUrl().replace('/api', ''));

const emit = defineEmits(['update:user', 'close:addSocial']);
const { socialsSchema } = useFormRules();

const { create, update, delete: _delete } = useStrapi();
const client = useStrapiClient();
const { updateImage } = useUploadedImage();
const messageStore = useMessageStore();

type Social = {
  name: string;
  url: string;
  icon: any;
  id: number;
};

const props = defineProps({
  social: {
    type: Object as PropType<Social>,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  label1: {
    type: String,
  },
  label2: {
    type: String,
  },
  canEdit: {
    type: Boolean,
    required: true,
  },
  isAdding: {
    type: Boolean,
  },
  id: {
    type: Number,
    required: true,
  },
});

const { social, loading, canEdit, isAdding } = toRefs(props);
const isEditing = ref(false);

const newIcon = ref<string | null>(null);
const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema: socialsSchema,

  keepValuesOnUnmount: true,
});

const updateValues = handleSubmit(async (e) => {
  loading.value = true;
  try {
    const promises: any = [];

    if (newIcon.value) {
      const formData = new FormData();
      const response = await fetch(newIcon.value);
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
            if (isAdding.value) {
              create('socials', {
                icon: result[0].id,
                name: controlledValues.value.name,
                url: controlledValues.value.url,
                users_permissions_user: props.id,
              }).finally(() => emit('close:addSocial'));
            } else {
              update(`socials/${social.value.id}`, {
                icon: result[0].id,
                name: controlledValues.value.name,
                url: controlledValues.value.url,
                users_permissions_user: props.id,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          }),
      );
    } else {
      let socialId = social.value.id;
      promises.push(
        update(`socials/${socialId}`, {
          name: controlledValues.value.name,
          url: controlledValues.value.url,
          users_permissions_user: props.id,
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
    isEditing.value = false;
    newIcon.value = null;
  }
});

const deleteSocial = async (index) => {
  await _delete('socials', social.value.id);
  emit('update:user', {});
};

async function updateSocialIcon(event: any, iconId: number) {
  const { updatedAt } = await updateImage(event, iconId);
  const url = social.value.icon.url.split('?');
  if (url) social.value.icon.url = url[0] + '?' + updatedAt;
}

async function uploadNewIcon(e: any) {
  newIcon.value = URL.createObjectURL(e.target.files[0]);
}
</script>

<style global lang="scss">
.contact-item {
  gap: 16px;

  input {
    padding-top: 0;
  }
  .v-input.v-input--horizontal {
    :last-child {
      padding-top: 0px !important;
      .v-messages {
        transform: translateY(-5px);
      }
    }
  }

  .icon {
    transition: all ease-in-out 1s;
    width: 24px;
    height: 24px;
   
    path {
      fill: #5d6872;
    }
  }

  .img-upload {
    border: 1px solid #D2D6DA;
    border-radius: 8px;

    .edit {
      border: none;
      
      img {
        border: none;
      }
    }
  }

  .icon.upload {
    width: 32px !important;
    height: 32px !important;
    cursor: pointer;
    path {
      fill: #5d6872;
    }
  }

  .field {
    a {
      cursor: pointer;
      color: #abb2b9;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      text-decoration: none;
    }
  }

  * {
    max-height: 36px !important;
  }
}
</style>
