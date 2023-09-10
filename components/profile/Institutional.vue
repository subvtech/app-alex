<template>
  <profile-card title="Institucional" :full-width="true">
    <template v-slot:content>
      <div class="d-flex flex-wrap items">
        <div
          class="d-flex pa-4 align-center item"
          v-for="(item, index) in institutions"
        >
          <img :src="strapiBaseUrl + item.cover.url" :alt="item.name" />

          <div class="d-flex flex-column justify-center">
            <span>{{ item.acronym + ' - ' + item.name }}</span>
            <p>{{ item.sector }}</p>
          </div>
          <div v-if="canEdit" class="menu">
            <v-icon
              @click="showDropdown = !showDropdown"
              color="#6E7A87"
              style="cursor: pointer"
              >mdi-dots-vertical</v-icon
            >
            <v-icon
              v-if="showDropdown"
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
    </template>
  </profile-card>
</template>

<script setup lang="ts">
const { update } = useStrapi();
const strapiBaseUrl = computed(() => useStrapiUrl().replace('/api', ''));
const showDropdown = ref(false);

type Institution = {
  name: string;
  acronym: string;
  sector: string;
  id: number;
  cover: any;
};
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

const removeInstitution = async (index) => {
  const list = institutions.value
    .map((item) => item.id)
    .filter((id) => id !== index);
  const data = { institutions: list };
  const url = useStrapiUrl() + '/users/' + props.id;
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data }),
  };

  await fetch(url, options);
};
</script>

<style scoped lang="scss">
.items {
  gap: 24px;
  .item {
    gap: 12px;
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

    .menu {
      position: relative;

      .remove {
        cursor: pointer;

        position: absolute;
        top: -38px;
        left: 18px;
      }
    }
  }
}
</style>
