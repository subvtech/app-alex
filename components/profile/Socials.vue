<template>
  <profile-card
    :title="$t('components.profile.socials.title')"
    :cancel="cancel"
    :save="save"
    :showIcon="canEdit"
    :isEditing="isEditing && canEdit"
    :full-width="true"
    @toogle:isEditing="isEditing = !isEditing"
  >
    <template class="d-flex w-100" v-slot:content>
      <div
        v-if="
          socials.length === 0 ||
          (socials.length === deleteArray.length &&
            socials.every((item) =>
              deleteArray.some((item2) => item.id === item2.socialId),
            ))
        "
        class="empty d-flex flex-column justify-center align-center"
        style="gap: 16px"
      >
        <NuxtImg src="/svg/EmptySocials.svg" placeholder />
        <span>{{ $t('components.profile.socials.empty') }}</span>
      </div>
      <div v-else>
        <div
          class="rounded-lg"
          style="box-sizing: border-box; border: 1px solid #d2d6da"
        >
          <v-expansion-panels
            class=""
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
              @end="handleDrop"
              handle=".handle"
            >
              <template #item="{ element, index }">
                <profile-inputs-social
                  :socialId="element.id"
                  :url="element.url"
                  :name="element.name"
                  :index="index"
                  :key="index"
                  :isLast="socials.length - 1 === index"
                  :canEdit="isEditing && canEdit"
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
        <profile-inputs-add-social
          @close:add-social="isAdding = false"
          @save:add-social="addSocial"
          :socials="missingSocials"
        />
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';

const isEditing = ref(false);
const isAdding = ref(false);
const componentKey = ref(0);

const emit = defineEmits(['update:user']);
const { create, update, delete: _delete } = useStrapi();

const props = defineProps({
  socials: {
    type: Array as PropType<
      {
        id: number;
        socialId: number;
        url: string;
        name: string;
        index: number;
      }[]
    >,
    required: true,
  },
  canEdit: {
    type: Boolean,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

const { id, socials, canEdit } = toRefs(props);

const missingSocials = ref<string[]>([]);
const sortedSocials = ref<
  {
    id: number;
    socialId: number;
    url: string;
    name: string;
    index: number;
  }[]
>([]);

const sortSocials = () => {
  sortedSocials.value = [...socials.value].sort((a, b) =>
    a.index > b.index ? 1 : b.index > a.index ? -1 : 0,
  );
};

onMounted(() => {
  sortSocials();
  if (!socials.value.find((element) => element.name === 'instagram'))
    missingSocials.value.push('Instagram');
  if (!socials.value.find((element) => element.name === 'youtube'))
    missingSocials.value.push('Youtube');
  if (!socials.value.find((element) => element.name === 'linkedin'))
    missingSocials.value.push('Linkedin');
  missingSocials.value.push('Outra rede');
});
const addSocial = async ({ value, value2, selectedSocial }) => {
  if (value2 === '') {
    await create('socials', {
      name: selectedSocial.toLowerCase(),
      url: value,
      index: socials.value.length,
      users_permissions_user: id.value,
    });
    missingSocials.value = missingSocials.value.filter(
      (e) => e !== selectedSocial,
    );
  } else {
    await create('socials', {
      name: value2,
      url: value,
      index: socials.value.length,
      users_permissions_user: id.value,
    });
  }

  isAdding.value = false;

  emit('update:user');
};
const deleteArray = ref<{ socialId: number; name: string }[]>([]);
const updateArray = ref<
  { socialId: number; url: string; name: string; index: number }[]
>([]);

const updateDeleteArray = ({ socialId, name }) => {
  deleteArray.value.push({ socialId: socialId, name: name });
};

const updateSocialMedia = ({ socialId, name, url, index }) => {
  const num = updateArray.value.findIndex((item) => item.socialId === socialId);

  if (num !== -1) updateArray.value[num] = { socialId, name, url, index };
  else updateArray.value.push({ socialId, name, url, index });
};

const save = async () => {
  const promises: Promise<any>[] = [];
  const supported = ['youtube', 'linkedin', 'instagram'];
  updateArray.value.forEach((item) => {
    promises.push(update(`/socials/${item.socialId}`, item));
  });

  deleteArray.value.forEach((item) => {
    promises.push(_delete(`/socials/${item.socialId}`));
    if (supported.includes(item.name))
      missingSocials.value = [
        item.name[0].toLocaleUpperCase() + item.name.slice(1),
      ].concat(missingSocials.value);
  });

  if (promises.length === 0) return;
  await Promise.all(promises);
  deleteArray.value = [];
  updateArray.value = [];
  emit('update:user');
};

const cancel = () => {
  componentKey.value = componentKey.value + 1;
  deleteArray.value = [];
  sortedSocials.value = socials.value;
};

watch(
  () => socials.value,
  () => sortSocials(),
  { deep: true },
);

const handleDrop = ({ oldIndex, newIndex }) => {
  sortedSocials.value.forEach((element, i) => {
    let temp = updateArray.value.findIndex(
      (item) => element.id === item.socialId,
    );
    if (temp !== -1) {
      updateArray.value[temp] = { ...updateArray.value[temp], index: i };
    } else {
      updateArray.value.push({
        socialId: element.id,
        url: element.url,
        name: element.name,
        index: i,
      });
    }
  });
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
