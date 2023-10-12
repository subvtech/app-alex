<template>
  <profile-card
    :title="$t('components.profile.socials.title')"
    :cancel="cancel"
    :save="save"
    :isEditing="isEditing && canEdit"
    :full-width="true"
    @toogle:isEditing="isEditing = !isEditing"
  >
    <template class="d-flex w-100" v-slot:content>
      <div
        v-if="
          (socials.length === 0 && !(instagram || youtube || linkedin)) ||
          socials.length === deleteArray.length
        "
        class="empty d-flex flex-column justify-center align-center"
        style="gap: 16px"
      >
        <img src="../../assets/svg/EmptySocials.svg" alt="" />
        <span>Nenhuma rede social adicionada</span>
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
              :list="socials"
              item-key="name"
              :disabled="!(isEditing && canEdit)"
              ghost-class="ghost"
              @start="dragging = true"
              @end="dragging = false"
              handle=".handle"
            >
              <template #item="{ element, index }">
                <profile-inputs-social
                  :socialId="element.id"
                  :url="element.url"
                  :name="element.name"
                  :key="index"
                  :loading="loading"
                  :isLast="socials.length - 1 === index"
                  :canEdit="isEditing && canEdit"
                  @social:delete="updateDeleteArray"
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
const loading = ref(false);

const dragging = ref(false);
const isEditing = ref(false);
const isAdding = ref(false);
const componentKey = ref(0);

const emit = defineEmits(['update:user']);
const client = useStrapiClient();
const { create, delete: _delete } = useStrapi();

const props = defineProps({
  socials: {
    type: Array as PropType<any[]>,
    required: true,
  },
  instagram: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  youtube: {
    type: String,
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

const { id, socials, instagram, youtube, linkedin, canEdit } = toRefs(props);

const missingSocials = ref<string[]>([]);
const currentSocials = ref<any[]>([]);

onMounted(() => {
  currentSocials.value = socials.value;
  if (!instagram!.value) missingSocials.value.push('Instagram');
  else currentSocials.value.push({ name: 'Instagram', url: instagram!.value });
  if (!youtube!.value) missingSocials.value.push('Youtube');
  else currentSocials.value.push({ name: 'Youtube', url: youtube!.value });
  if (!linkedin!.value) missingSocials.value.push('Linkedin');
  else currentSocials.value.push({ name: 'Linkedin', url: linkedin!.value });
  missingSocials.value.push('Outra rede');
});
const addSocial = async (e) => {
  if (e.value2) {
    await create('socials', {
      name: e.value2,
      url: e.value,
      users_permissions_user: id.value,
    });
  } else {
    const body = {};
    body[e.selectedSocial.toLowerCase()] = e.value;
    await client(`/users/${props.id}`, {
      method: 'PUT',
      body,
    });
  }
  isAdding.value = false;

  emit('update:user');
};
const deleteArray = ref<number[]>([]);
const updateDeleteArray = (e) => {
  deleteArray.value.push(e.socialId);
};

const save = async () => {
  const promises: Promise<any>[] = [];
  const body = {};

  deleteArray.value.forEach((value) => {
    promises.push(_delete(`/socials/${value}`));
  });

  if (promises.length === 0) return;
  const res = await Promise.all(promises);

  emit('update:user');
};

const cancel = () => {
  componentKey.value = componentKey.value + 1;
  deleteArray.value = [];
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
    z-index: 999;
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
