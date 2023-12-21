<template>
  <alex-custom-card
    :title="$t('components.profile.institutional.title')"
    :isEditing="isEditing && canEdit"
    :showIcon="canEdit"
    @toggle:isEditing="isEditing = !isEditing"
    :cancel="onCancel"
    :save="onSave"
    full-width
  >
    <template v-slot:content>
      <alex-inputs-institutions
        v-if="isEditing && canEdit"
        v-model:institutions="searchInstitutions"
        v-model:search="search"
        @update:value="updateSelectedOption"
        color="black"
        name="institution"
      />
      <div v-if="sortedInstitutions.length > 0" class="d-flex flex-wrap items">
        <draggable
          class="d-flex flex-column contacts w-100"
          :list="sortedInstitutions"
          item-key="name"
          :disabled="!(isEditing && canEdit)"
          :key="componentKey"
          ghost-class="ghost"
          handle=".handle"
        >
          <template
            class="d-flex pa-4 align-center justify-space-between w-100 item"
            #item="{ element, index }"
          >
            <profile-components-institution
              :canEdit="isEditing && canEdit"
              :index="index"
              :acronym="element.acronym"
              :sector="element.sector"
              :url="element.cover.url"
              :institutionId="element.id"
              :name="element.name"
              :isDeleted="deleteArray.includes(element.id)"
              @delete:institution="updateDeleteArray"
            />
          </template>
        </draggable>
      </div>
      <div
        v-else
        class="d-flex flex-column w-100 justify-center align-center pa-6"
        style="gap: 16px"
      >
        <img
          src="/svg/EmptyInstitutional.svg"
          width="160"
          height="160"
        />
        <span class="info text-center" style="color: rgb(175, 175, 175)">
          {{ $t('components.profile.institutional.emptyInstitutional') }}
        </span>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';

type Institution = {
  name: string;
  acronym: string;
  sector: string;
  id: number;
  index: number;
  cover: any;
};

const searchInstitutions = ref<Institution[]>([]);
const search = ref('');
const isEditing = ref(false);
const componentKey = ref(0);

const client = useStrapiClient();
const emit = defineEmits(['update:user']);

const props = defineProps({
  institutions: {
    type: Array as PropType<Institution[]>,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
});
const { userId, canEdit } = toRefs(props);

const updateSelectedOption = (selectedId) => {
  if (
    searchInstitutions.value.length === 0 ||
    isNaN(selectedId) ||
    selectedId < 0
  )
    return;
  if (
    !sortedInstitutions.value.find(
      (item) => item.id === searchInstitutions.value[selectedId].id,
    )
  ) {
    sortedInstitutions.value.push(searchInstitutions.value[selectedId]);

    if (
      !institutionsIds.value.includes(searchInstitutions.value[selectedId].id)
    )
      institutionsIds.value.push(searchInstitutions.value[selectedId].id);

    if (
      deleteArray.value.find(
        (id) => id === searchInstitutions.value[selectedId].id,
      )
    ) {
      deleteArray.value = deleteArray.value.filter(
        (id) => id !== searchInstitutions.value[selectedId].id,
      );
    }
  } else if (
    deleteArray.value.find(
      (id) => id === searchInstitutions.value[selectedId].id,
    )
  ) {
    deleteArray.value = deleteArray.value.filter(
      (id) => id !== searchInstitutions.value[selectedId].id,
    );
  }

  search.value = '';
};

const sortedInstitutions = ref<Institution[]>([...props.institutions]);
const institutionsIds = ref<number[]>(
  props.institutions.map((item) => item.id),
);
const deleteArray = ref<number[]>([]);

const updateDeleteArray = (id: number) => {
  deleteArray.value.push(id);
  institutionsIds.value = institutionsIds.value.filter((item) => item !== id);
};

const onSave = async () => {
  const connectArray: {
    id: number;
    position: {
      end?: boolean;
      start?: boolean;
      before?: number;
      after?: number;
    };
  }[] = [];
  if (sortedInstitutions.value.length !== 0) {
    sortedInstitutions.value.slice(1).forEach((item, index) => {
      if (!deleteArray.value.includes(sortedInstitutions.value[index].id)) {
        connectArray.push({
          id: item.id,
          position: { after: sortedInstitutions.value[index].id },
        });
      }
    });
    if (!deleteArray.value.includes(sortedInstitutions.value[0].id)) {
      if (sortedInstitutions.value.length <= deleteArray.value.length)
        sortedInstitutions.value = [];
      connectArray.push({
        id: sortedInstitutions.value[0].id,
        position: { start: true },
      });
    }
  }

  await client(`/users/${userId.value}`, {
    method: 'PUT',
    body: {
      institutions: {
        connect: connectArray,
        disconnect: deleteArray.value,
      },
    },
  });
  emit('update:user');
  deleteArray.value = [];
};

const onCancel = () => {
  componentKey.value = componentKey.value + 1;
  deleteArray.value = [];
  sortedInstitutions.value = [...props.institutions];
};
</script>

<style scoped lang="scss">
.btn {
  position: absolute;
  top: 20px;
  right: 10px;
  text-transform: none !important;
  font-weight: bold;
  font-size: 14px;
  border-radius: 8px;
}
.small {
  display: none;
  position: absolute;
  width: auto;
  height: auto;
  top: 20px;
  right: 10px;
  padding: 4px;
}
.items {
  gap: 24px;
}

@media (max-width: 400px) {
  .btn {
    display: none;
  }

  .small {
    display: block;
  }
}
</style>
