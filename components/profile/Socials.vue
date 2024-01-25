<template>
  <alex-custom-card
    :title="$t('components.profile.socials.title')"
    :cancel="cancel"
    :save="onSave"
    :showIcon="canEdit"
    :isEditing="isEditing && canEdit"
    full-width
    @toggle:isEditing="isEditing = !isEditing"
  >
    <template class="d-flex" v-slot:content>
     <div class="d-flex flex-column w-100 justify-center">
      <alex-custom-empty-placeholder
        v-if="sortedSocials.length === 0"
        empty-text-image="/svg/EmptySocials.svg"
        :empty-text-message="$t('components.profile.socials.empty')"
      />

      <div v-else class="w-100">
        <div
          class="rounded-lg"
          style="box-sizing: border-box; border: 1px solid #d2d6da"
        >
          <v-expansion-panels
            class="w-100"
            variant="accordion"
            theme="flat"
            :key="componentKey"
          >
            <draggable
              class="d-flex flex-column contacts w-100"
              :list="sortedSocials"
              item-key="name"
              :disabled="!(isEditing && canEdit)"
              ghost-class="ghost"
              handle=".handle"
              @end="isChanged = true"
            >
              <template #item="{ element, index }">
                <profile-components-social
                  :socialId="element.id"
                  :url="element.url"
                  :name="element.name"
                  :index="index"
                  :key="index"
                  :disabled="disabled"
                  :isLast="sortedSocials.length - 1 === index"
                  :canEdit="isEditing && canEdit"
                  :onError="() => (disabled = true)"
                  :onSuccess="() => (disabled = false)"
                  @update:social="updateSocialMedia"
                  @delete:social="updateDeleteArray"
                />
              </template>
            </draggable>
          </v-expansion-panels>
        </div>
      </div>
      <div v-if="isEditing && canEdit" class="d-flex justify-center mt-6">
        <v-btn
          class="btn"
          @click="isAdding = true"
          variant="outlined"
          prepend-icon="mdi-plus"
        >
          {{ $t('components.profile.general.addSocial') }}</v-btn
        >
      </div>
      <div v-if="isAdding" class="add-social">
        <profile-components-add-social
          @close:add-social="isAdding = false"
          @save:add-social="addSocial"
          :socials="updatedMissingSocials"
        />
      </div>
     </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import { SocialItemType } from '~/models/social.model';
const i18n = useI18n();

const isEditing = ref(false);
const isAdding = ref(false);
const isChanged = ref(false);
const disabled = ref(false);
const componentKey = ref(0);

const emit = defineEmits(['update:user']);
const { create, update, delete: _delete } = useStrapi();


const props = defineProps({
  socials: {
    type: Array as PropType<SocialItemType[]>,
    required: true,
  },
  canEdit: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
});

const { userId, socials, canEdit } = toRefs(props);

const supported = ['youtube', 'linkedin', 'instagram'];

const client = useStrapiClient();

const sortedSocials = ref<
  {
    id?: number;
    url: string;
    name: string;
  }[]
>([...socials.value]);
const missingSocials = ref<string[]>([]);
const updatedMissingSocials = ref<string[]>([]);

onMounted(() => {
  if (!sortedSocials.value.find((element) => element.name === 'instagram'))
    missingSocials.value.push('Instagram');
  if (!sortedSocials.value.find((element) => element.name === 'youtube'))
    missingSocials.value.push('Youtube');
  if (!sortedSocials.value.find((element) => element.name === 'linkedin'))
    missingSocials.value.push('Linkedin');
  missingSocials.value.push(i18n.t('components.profile.socials.otherSocial'));
  updatedMissingSocials.value = [...missingSocials.value];
});

const addSocial = async ({ value, value2, selectedSocial }) => {
  const addedSocial = {
    name: value2 === '' ? selectedSocial.toLowerCase() : value2,
    url: value,
    users_permissions_user: userId.value,
  };

  if (supported.includes(selectedSocial.toLowerCase()))
    updatedMissingSocials.value = updatedMissingSocials.value.filter(
      (e) => e !== selectedSocial,
    );
  sortedSocials.value.push(addedSocial);

  isAdding.value = false;
  isChanged.value = true;
};
const deleteArray = ref<number[]>([]);
const updateArray = ref<{ socialId: number; url: string; name: string }[]>([]);

const updateDeleteArray = ({ socialId, name, index }) => {
  if (socialId) {
    sortedSocials.value = sortedSocials.value.filter((item) => {
      return item.id !== socialId;
    });
    deleteArray.value.push(socialId);
  } else {
    sortedSocials.value.splice(index, 1);
  }
  isChanged.value = true;
  if (supported.includes(name))
    updatedMissingSocials.value = [
      name[0].toLocaleUpperCase() + name.slice(1),
    ].concat(updatedMissingSocials.value);
};

const updateSocialMedia = ({ socialId, name, url, index }) => {
  const num = updateArray.value.findIndex((item) => item.socialId === socialId);
  const updatedObject = {
    ...sortedSocials.value[index],
  };
  if (name) updatedObject.name = name;
  if (url) updatedObject.url = url;

  sortedSocials.value[index] = updatedObject;
  if (num !== -1) updateArray.value[num] = { socialId, name, url };
  else updateArray.value.push({ socialId, name, url });
};
const resetArrays = () => {
  deleteArray.value = [];
  updateArray.value = [];
  isChanged.value = false;
};

const onSave = async () => {
  const promises: Promise<any>[] = [];

  const connectArray: {
    id: number;
    position: {
      end?: boolean;
      start?: boolean;
      before?: number;
      after?: number;
    };
  }[] = [];
  if (!isChanged.value) {
    resetArrays();
    return;
  }
  if (sortedSocials.value.length !== 0) {
    sortedSocials.value.forEach((item, index) => {
      const position =
        index === 0
          ? { start: true }
          : index === sortedSocials.value.length - 1
          ? { end: true }
          : { after: sortedSocials.value[index - 1].id };
      if (item.id) {
        if (!deleteArray.value.includes(item.id)) {
          connectArray.push({
            id: item.id,
            position,
          });
        }
      } else {
        promises.push(
          create('socials', item).then((result) => {
            sortedSocials.value[index].id = result.data.id;
            connectArray.push({
              id: result.data.id,
              position,
            });
          }),
        );
      }
    });
  }

  if (deleteArray.value.length !== 0) {
    deleteArray.value.forEach((item) => {
      promises.push(_delete(`/socials/${item}`));
    });
  }

  if (connectArray.length !== 0)
    promises.push(
      client(`/users/${userId.value}`, {
        method: 'PUT',
        body: {
          socials: {
            connect: connectArray,
            disconnect: deleteArray.value,
          },
        },
      }),
    );

  if (promises.length === 0) {
    resetArrays();
    return;
  }
  await Promise.all(promises);

  resetArrays();
  emit('update:user');
};

const cancel = () => {
  componentKey.value = componentKey.value + 1;
  deleteArray.value = [];
  updateArray.value = [];
  sortedSocials.value = [...socials.value];
  isChanged.value = false;
  updatedMissingSocials.value = [...missingSocials.value];
};
</script>

<style scoped lang="scss">
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
#Card {
  //border-bottom: 1px solid #eaeef1;
  flex-direction: column;

  .empty {
    span {
      color: #6e7a87;
      text-align: center;
      /* Body/P1 */

      font-size: 16px;
      font-weight: 400;
      line-height: 135%; /* 21.6px */
      letter-spacing: 0.32px;
    }
  }

  .add-social {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
  }
}

.btn {
  text-transform: none;
  color: #6e7a87 !important;
  border-width: 0;
  background-color: #f1f5f9;
  font-weight: 700;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}

@media (max-width: 400px) {
  #Card {
    .btn {
      width: 100%;
    }
  }
}
</style>
