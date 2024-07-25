<template>
  <alex-custom-skeleton
    v-if="loading"
    class="w-100 height-33"
    color="gray-200"
  />
  <div v-else class="box-info d-flex">
    <v-icon v-if="icon.startsWith('mdi')" color="#00B8CC">{{ icon }}</v-icon>
    <img v-else :src="`svg/${icon}`" width="24" height="24" />
    <div class="d-flex">
      <h6>{{ number }}</h6>
      <p>
        {{
          $t(
            `components.appGeneralBoxes.${label}.${
              number === 1 ? 'singular' : 'plural'
            }`,
          )
        }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
export interface BoxItemType {
  label: 'courses' | 'students' | 'trails' | 'projects' | 'assignments';
  icon: string;
  loading?: boolean;
  number?: number;
}
withDefaults(defineProps<BoxItemType>(), {
  number: 0,
  loading: false,
});
</script>
<style scoped lang="scss">
.box-info {
  flex-direction: column;
  min-width: 90px;
  min-height: 90px;
  width: 33%;
  gap: 16px;
  padding-inline: 16px;
  padding-block: 16px;
  align-items: flex-start;
  border-radius: 8px;
  border: 1px solid #e1e4e7;
  background-color: #f1f5f9;

  :last-child {
    flex-direction: column;

    h6 {
      font-size: 24px;
      color: #0d4173;
    }

    p {
      color: #a0a8b1 !important;
      font-size: 16px !important;
      font-style: normal;
      font-weight: 400 !important;
      line-height: 135%; /* 21.6px */
      letter-spacing: 0.64px;
    }
  }
}
@media (max-width: 450px) {
  .box-info {
    flex-direction: row;
    width: 100%;
    max-width: none;
    padding-inline: 16px;
    padding-block: 0px;
    align-items: center;
    :last-child {
      flex-direction: row;
      align-items: center;
      gap: 8px;

      p {
        color: #0d4173;
        font-size: 14px;
        font-weight: 400;
      }

      span {
        color: #5d6872;
        font-size: 16px;
        font-weight: 700;
        line-height: 22px;
      }
    }
  }
}
</style>
