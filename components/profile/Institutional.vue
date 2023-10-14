<template>
  <profile-card
    :title="$t('components.profile.institutional.title')"
    :full-width="true"
    :isEditing="isEditing && canEdit"
    @toogle:isEditing="isEditing = !isEditing"
    :cancel="onCancel"
    :save="showSearch"
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
      <div v-if="institutions.length > 0" class="d-flex flex-wrap items">
        <draggable
          class="d-flex flex-column contacts w-100"
          :list="sortedInstitutions"
          item-key="name"
          :disabled="!(isEditing && canEdit)"
          :key="componentKey"
          ghost-class="ghost"
          @end="handleDrop"
          handle=".handle"
        >
          <template
            class="d-flex pa-4 align-center justify-space-between w-100 item"
            #item="{ element, index }"
          >
            <profile-inputs-institution
              :canEdit="isEditing && canEdit"
              :index="index"
              :acronym="element.acronym"
              :sector="element.sector"
              :url="element.cover.url"
              :institutionId="element.id"
              :id="id"
              :name="element.name"
              @delete:institution="updateDeleteArray"
            />
          </template>
        </draggable>
      </div>
      <div
        v-else
        class="d-flex flex-column justify-center align-center pa-6"
        style="gap: 16px"
      >
        <NuxtImg
          src="/svg/EmptyInstitutional.svg"
          placeholder
          style="height: 160px; width: 160px"
        />
        <span class="info text-center" style="color: rgb(175, 175, 175)">
          {{ $t('components.profile.institutional.emptyInstitutional') }}
        </span>
      </div>
    </template>
  </profile-card>
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

const isAddingInstitution = ref(false);
const searchInstitutions = ref<Institution[]>([]);
let selectedOption = ref(0);
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
  id: {
    type: Number,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
});
const { institutions, id, canEdit } = toRefs(props);

const updateSelectedOption = (event) => {
  selectedOption.value = event;
};

const sortedInstitutions = ref<Institution[]>([]);
const updateArray = ref<Institution[]>([]);

const sortInstitutions = () => {
  sortedInstitutions.value = [...institutions.value].sort((a, b) =>
    a.index > b.index ? 1 : b.index > a.index ? -1 : 0,
  );
};

const deleteArray = ref<{ institutionId: number; name: string }[]>([]);

onMounted(() => {
  sortInstitutions();
});

const updateDeleteArray = ({ institutionId, name }) => {
  deleteArray.value.push({ institutionId: institutionId, name: name });
};

const removeInstitution = async (index) => {
  const list = institutions.value
    .map((item) => item.id)
    .filter((id) => id !== index);

  await client(`/users/${id.value}`, {
    method: 'PUT',
    body: { institutions: list },
  });
  emit('update:user');
};

const showSearch = async () => {
  if (searchInstitutions.value) {
    if (searchInstitutions.value.length > 0) {
      const list = institutions.value.map((item) => item.id);

      list.push(
        { ...{ ...searchInstitutions.value }[selectedOption.value] }.id,
      );

      await client(`/users/${props.id}`, {
        method: 'PUT',
        body: { institutions: list },
      });

      emit('update:user', {});
    }

    isAddingInstitution.value = false;
  } else {
    isAddingInstitution.value = true;
  }
};

const handleDrop = ({ oldIndex, newIndex }) => {
  sortedInstitutions.value.forEach((element, i) => {
    let temp = updateArray.value.findIndex((item) => element.id === item.id);
    if (temp !== -1) {
      updateArray.value[temp] = { ...updateArray.value[temp], index: i };
    } else {
      updateArray.value.push({
        ...element,
        index: i,
      });
    }
  });
};

const onSave = () => {};

const onCancel = () => {
  componentKey.value = componentKey.value + 1;
  deleteArray.value = [];
  sortedInstitutions.value = institutions.value;
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
