<template>
  <div
    class="boxes d-flex justify-center w-100 pb-6"
    :class="hideDivider ? '' : 'border-bottom'"
  >
    <div class="box d-flex" v-for="(box, index) in boxes" :key="index">
      <v-icon v-if="box.icon.startsWith('mdi')" color="#00B8CC">{{
        box.icon
      }}</v-icon>
      <img v-else :src="`/svg/${box.icon}`" width="24" height="24" />
      <div class="d-flex">
        <h6>{{ box.number }}</h6>
        <p>
          {{
            $t(
              `components.appGeneralBoxes.${box.label}.${
                box.number === 1 ? 'singular' : 'plural'
              }`,
            )
          }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const i18n = useI18n();

const props = defineProps({
  boxes: {
    type: Array as PropType<
      {
        icon: string;
        number: number;
        label: 'courses' | 'students' | 'trails' | 'projects' | 'assignments';
      }[]
    >,
    default: [],
  },
  hideDivider: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped lang="scss">
.boxes {
  gap: 16px;
  &.border-bottom {
    border-bottom: 1px solid #eaeef1;
  }
  .box {
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
}
</style>
