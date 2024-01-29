<template>
  <alex-custom-card
    :title="$t('components.profile.institutional.title')"
    :isEditing="canEditAndIsEditing"
    :showIcon="canEdit"
    @toggle:isEditing="isEditing = !isEditing"
    :cancel="onCancel"
    :save="onSave"
    align-content="align-center"
    full-width
  >
    <template #content>
      <alex-inputs-institutions
        v-if="canEditAndIsEditing"
        v-model:institutions="searchInstitutions"
        v-model:search="search"
        @update:model-value="updateSelectedOption"
        color="black"
        class="w-100"
        name="institution"
      />

      <div
        v-if="sortedInstitutions.length > 0"
        class="d-flex flex-wrap gap-6 w-100"
      >
        <draggable
          class="d-flex flex-row flex-wrap contacts gap-6 w-100 justify-center w-100"
          :list="sortedInstitutions"
          item-key="name"
          :disabled="!canEditAndIsEditing"
          :key="componentKey"
          ghost-class="ghost"
          handle=".handle"
        >
          <template
            class="d-flex align-center justify-space-between item w-100"
            #item="{ element, index }"
          >
            <alex-profile-institution-item
              :canEdit="canEditAndIsEditing"
              :index="index"
              :acronym="element.acronym"
              :sector="element.sector"
              :url="element.cover?.url ?? element.url"
              :institutionId="element.id"
              :name="element.name"
              :isDeleted="deleteArray.includes(element.id)"
              @delete:institution="updateDeleteArray"
            />
          </template>
        </draggable>
      </div>
      <alex-custom-empty-placeholder
        v-else
        empty-text-image="/svg/EmptyInstitutional.svg"
        :empty-text-message="
          $t('components.profile.institutional.emptyInstitutional')
        "
      />
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';

export interface InstitutionsComponentType {
  institutions: InstitutionsType[];
  userId: number;
  canEdit: boolean;
}

export interface InstitutionsEmits {
  (e: 'update'): void;
}

const emit = defineEmits<InstitutionsEmits>();

const client = useStrapiClient();

const props = withDefaults(defineProps<InstitutionsComponentType>(), {
  canEdit: false,
});

const { canEdit } = toRefs(props);

const searchInstitutions = ref<InstitutionsType[]>([]);
const search = ref('');
const isEditing = ref(false);
const componentKey = ref(0);

const findInstitution = (selectedId) => {
  return sortedInstitutions.value.find((item) => item.id === selectedId);
};

const updateSelectedOption = (selectedId) => {
  if (
    searchInstitutions.value.length === 0 ||
    isNaN(selectedId) ||
    selectedId < 0
  )
    return;

  const selectedInstitution = searchInstitutions.value.find(
    (item) => item.id == selectedId,
  );
  if (!selectedInstitution) return;
  if (!findInstitution(selectedId)) {
    sortedInstitutions.value.push(selectedInstitution);

    if (!institutionsIds.value.includes(selectedId))
      institutionsIds.value.push(selectedId);

    if (deleteArray.value.find((id) => id === selectedId)) {
      deleteArray.value = deleteArray.value.filter((id) => id !== selectedId);
    }
  } else if (deleteArray.value.find((id) => id === selectedId)) {
    deleteArray.value = deleteArray.value.filter((id) => id !== selectedId);
  }

  search.value = '';
};

const canEditAndIsEditing = computed(() => canEdit.value && isEditing.value);

const sortedInstitutions = ref<InstitutionsType[]>([...props.institutions]);
const institutionsIds = ref<number[]>(
  props.institutions.map((item) => item.id),
);
const deleteArray = ref<number[]>([]);

const updateDeleteArray = (id: number) => {
  sortedInstitutions.value = sortedInstitutions.value.filter(
    (item) => item.id !== id,
  );
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
      connectArray.push({
        id: sortedInstitutions.value[0].id,
        position: { start: true },
      });
    }
  }

  await client(`/users/${props.userId}`, {
    method: 'PUT',
    body: {
      institutions: {
        connect: connectArray,
        disconnect: deleteArray.value,
      },
    },
  });

  emit('update');
  deleteArray.value = [];
};

const onCancel = () => {
  componentKey.value = componentKey.value + 1;
  deleteArray.value = [];
  sortedInstitutions.value = [...props.institutions];
  searchInstitutions.value = [];
};
</script>

<style scoped lang="scss"></style>
