<template>
  <div class="user-block my-6">
    <div class="cover-block w-100">
      <NuxtImg
        v-if="cover"
        class="cover"
        provider="strapi"
        :src="cover.url"
        placeholder
      />
      <NuxtImg
        v-else
        class="cover"
        src="https://picsum.photos/2200/500"
        placeholder
      />
      <div v-if="canEdit" class="edit-cover d-flex align-center">
        <v-btn
          v-if="cover"
          class="btn remove"
          @click="removeCoverPicture"
          size="large"
          icon
          variant="outlined"
        >
          <v-icon class="icon" size="20" color="#6E7A87"
            >mdi-trash-can-outline</v-icon
          >
        </v-btn>

        <label class="" for="coverInput">
          <v-btn
            class="btn label"
            @click="($refs.coverInput as any).click()"
            size="large"
            icon
            variant="outlined"
          >
            <v-icon class="icon" size="20" color="#6E7A87"
              >mdi-pencil-outline</v-icon
            >

            <p>{{ $t('pages.profile.cover') }}</p></v-btn
          >
          <v-btn
            class="btn label small"
            @click="($refs.coverInput as any).click()"
            size="large"
            icon="mdi-pencil-outline"
            variant="outlined"
          />
        </label>

        <input
          class="d-none"
          @input="uploadCoverPicture"
          accept="image/png, image/jpeg"
          ref="coverInput"
          id="coverInput"
          type="file"
        />
      </div>
    </div>
    <div
      class="d-flex justify-space-between align-center pl-sm-10 pr-xl-10 pr-md-8 pr-sm-6 pr-xs-4"
      style="padding-left: 32px"
    >
      <div class="card">
        <div class="photo" :class="canEdit ? 'hover' : ''">
          <label v-if="avatar" class="avatar" for="file-input">
            <NuxtImg
              class="img"
              provider="strapi"
              :src="avatar.url"
              :alt="fullname"
              placeholder
            />

            <v-icon v-if="canEdit" class="d-none" size="x-large" color="#fff"
              >mdi-pencil-outline</v-icon
            >
            <input
              v-if="canEdit"
              class="d-none"
              @input="uploadProfilePicture"
              accept="image/png, image/jpeg"
              id="file-input"
              type="file"
            />
          </label>
          <label v-else class="avatar" for="file-input">
            <div
              class="img d-flex justify-center align-center"
              alt="profile picture"
            >
              <v-icon size="40" color="#B9BFC6">mdi-account-outline</v-icon>
            </div>
            <v-icon v-if="canEdit" class="d-none" size="x-large" color="#fff"
              >mdi-plus</v-icon
            >
            <input
              v-if="canEdit"
              class="d-none"
              @input="uploadProfilePicture"
              accept="image/png, image/jpeg"
              id="file-input"
              type="file"
            />
          </label>
          <div
            v-if="canEdit && avatar"
            class="delete d-flex justify-center align-center"
            @click="removeProfilePicture"
          >
            <v-icon class="small-icon" size="x-small" color="#fff"
              >mdi-trash-can-outline</v-icon
            >
            <v-icon class="normal-icon" size="20" color="#fff"
              >mdi-trash-can-outline</v-icon
            >
          </div>
        </div>

        <div class="info">
          <div class="d-flex">
            <span class="fullname">
              {{ fullname }}
            </span>
            <span class="social">@{{ username }} </span>
          </div>

          <span class="role">
            {{
              isProfessor
                ? $t('pages.profile.teacher')
                : $t('pages.profile.student')
            }}
          </span>
        </div>
      </div>

      <v-icon
        v-if="canEdit"
        @click="
          () => {
            emit('display:settings');
          }
        "
        class="mr-4 mr-md-3 mr-sm-3 mr-xs-2"
        color="#6E7A87"
        >mdi-cog-outline</v-icon
      >
    </div>
    <div class="menu d-flex">
      <span
        v-for="(link, index) in links"
        :class="selectedOption === index ? 'selected' : ''"
        @click="emit('selected:option', index)"
      >
        {{ link }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['selected:option', 'display:settings']);
const { updateImage, uploadImage, removeImage } = useUploadedImage();
const client = useStrapiClient();

const props = defineProps({
  coverPicture: {
    type: Object as PropType<{ url: string; id: number } | null>,
    required: true,
  },

  profilePicture: {
    type: Object as PropType<{ url: string; id: number } | null>,
    required: true,
  },

  userId: {
    type: Number,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  selectedOption: {
    type: Number,
    default: 0,
  },
  links: {
    type: Array as PropType<string[]>,
    default: [],
  },
  isProfessor: { type: Boolean, default: false },
  canEdit: { type: Boolean, required: true },
});

const { selectedOption, fullname, username, canEdit, userId } = toRefs(props);

const avatar = ref<{ id: number; url: string } | null>(props.profilePicture);
const cover = ref<{ id: number; url: string } | null>(props.coverPicture);

async function uploadCoverPicture(event: any) {
  if (cover.value) {
    const { updatedAt } = await updateImage(event, cover.value.id);
    const url = cover.value.url?.split('?');
    if (url) cover.value.url = url[0] + '?' + updatedAt;
  } else {
    const temp = await uploadImage(event);

    cover.value = { url: temp[0].url, id: temp[0].id };
    await client(`/users/${props.userId}`, {
      method: 'PUT',
      body: { cover: temp[0].id },
    });
  }
}

async function removeCoverPicture() {
  if (!cover.value) return;
  await removeImage(cover.value.id);
  cover.value = null;
}

async function uploadProfilePicture(event: any) {
  if (avatar.value) {
    const { updatedAt } = await updateImage(event, avatar.value.id);

    const url = avatar.value.url?.split('?');
    if (url) avatar.value.url = url[0] + '?' + updatedAt;
  } else {
    const temp = await uploadImage(event);
    avatar.value = { url: temp[0].url, id: temp[0].id };

    await client(`/users/${props.userId}`, {
      method: 'PUT',
      body: { avatar: temp[0].id },
    });
  }
}

async function removeProfilePicture() {
  if (!avatar.value) return;
  await removeImage(avatar.value.id);
  avatar.value = null;
}
</script>

<style scoped lang="scss"></style>
