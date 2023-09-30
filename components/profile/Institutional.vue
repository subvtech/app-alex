<template>
  <profile-card
    :title="$t('components.profile.institutional.title')"
    :full-width="true"
    style="max-width: 1138px"
  >
    <template v-slot:content>
      <v-btn
        v-if="canEdit"
        class="btn"
        color="accent"
        @click="showSearch"
        variant="outlined"
      >
        {{
          isAddingInstitution
            ? $t('components.profile.institutional.save')
            : $t('components.profile.institutional.add')
        }}</v-btn
      >

      <v-btn
        v-if="canEdit"
        class="small"
        color="accent"
        :icon="isAddingInstitution ? 'mdi-check-bold' : 'mdi-plus'"
        @click="showSearch"
        variant="outlined"
      />

      <alex-inputs-institutions
        v-if="isAddingInstitution"
        v-model:institutions="searchInstitutions"
        v-model:search="search"
        @update:value="updateSelectedOption"
        color="black"
        name="institution"
      />
      <div v-if="institutions.length > 0" class="d-flex flex-wrap items">
        <div
          class="d-flex pa-4 align-center justify-space-between w-100 item"
          v-for="(item, index) in institutions"
        >
          <div class="d-flex" style="gap: 12px">
            <img :src="strapiBaseUrl + item.cover.url" :alt="item.name" />

            <div class="d-flex flex-column justify-center">
              <span>{{ item.acronym + ' - ' + item.name }}</span>
              <p>{{ item.sector }}</p>
            </div>
          </div>
          <div v-if="canEdit" class="options">
            <v-icon
              @click="updateShowDeleteButton(index)"
              color="#6E7A87"
              style="cursor: pointer"
              >mdi-dots-vertical</v-icon
            >
            <v-icon
              v-if="showDeleteButton.includes(index)"
              class="remove"
              @click="removeInstitution(item.id)"
              color="red"
              size="small"
            >
              mdi-close-outline
            </v-icon>
          </div>
        </div>
      </div>
      <div v-else class="d-flex flex-column justify-center align-center pa-6" style="gap: 16px">
        <img src="../../assets/svg/EmptyInstitutional.svg" alt=""  style="height: 160px; width: 160px">
        <span class="info text-center" style="color: rgb(175, 175, 175);">
          {{ $t('components.profile.institutional.emptyInstitutional') }}
        </span>
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts">
type Institution = {
  name: string;
  acronym: string;
  sector: string;
  id: number;
  cover: any;
};

const strapiBaseUrl = computed(() => useStrapiUrl().replace('/api', ''));
const showDeleteButton = ref<number[]>([]);
const isAddingInstitution = ref(false);
const searchInstitutions = ref<Institution[]>([]);
let selectedOption = ref(0);
const search = ref('');
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
const { institutions } = toRefs(props);

const updateSelectedOption = (event) => {
  selectedOption.value = event;
};

const updateShowDeleteButton = (index: number) => {
  showDeleteButton.value.includes(index)
    ? showDeleteButton.value.splice(showDeleteButton.value.indexOf(index), 1)
    : showDeleteButton.value.push(index);
};

const showSearch = async () => {
  if (isAddingInstitution.value && searchInstitutions.value) {
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

const removeInstitution = async (index) => {
  const list = institutions.value
    .map((item) => item.id)
    .filter((id) => id !== index);

  await client(`/users/${props.id}`, {
    method: 'PUT',
    body: { institutions: list },
  });
  emit('update:user', {});
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
  .item {
    position: relative;
    color: #5d6872;
    line-height: 22px;

    border-radius: 8px;
    border: 1px solid #eaeef1;
    span {
      font-size: 20px;
      font-weight: 700;
    }
    p {
      font-size: 16px;
      font-weight: 400;
    }
    img {
      width: 80px;
      height: 80px;

      border-radius: 8px;
      border: 1px solid #eaeef1;
    }

    .options {
      .remove {
        cursor: pointer;

        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
  }
  @media (max-width: 600px) {
    .item {
      span {
        font-size: 18px;
      }
      p {
        font-size: 14px;
      }
    }
  }

  @media (max-width: 349px) {
    .item {
      img {
        display: none;
      }
    }
  }
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
