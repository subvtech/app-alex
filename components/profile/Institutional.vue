<template>
  <profile-card title="Institucional" :full-width="true">
    <template v-slot:content>
      <div class="d-flex flex-wrap items">
        <div class="d-flex pa-4 item" v-for="item in institutions">
          <img :src="strapiBaseUrl + item.cover.url" :alt="item.name" />

          <div class="d-flex flex-column">
            <span>{{ item.acronym + '-' + item.name }}</span>
            <p>{{ item.sector }}</p>
          </div>
        </div>
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts">
const strapiBaseUrl = computed(() => useStrapiUrl().replace('/api', ''));

type Institution = {
  name: string;
  acronym: string;
  sector: string;
  cover: any;
};
const props = defineProps({
  institutions: {
    type: Array as PropType<Institution[]>,
    required: true,
  },
});
const { institutions } = toRefs(props);
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
  }
}
</style>
