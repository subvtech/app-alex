<template>
  <profile-card
    class="mb-6"
    :title="$t('components.profile.about.title')"
    :full-width="true"
    style="max-width: 1138px"
  >
    <template v-slot:content class="pa-6">
      <span v-if="info && info !== ''" class="info">
        {{ info }}
      </span>
      <div v-else class="d-flex flex-column justify-center align-center" style="gap: 16px;">
        <img
          src="../../assets/svg/EmptyAbout.svg"
          alt=""
          style="height: 160px; width: 160px"
        />
        <span class="info text-center" style="color: rgb(175, 175, 175);">
          {{ $t('components.profile.about.placeholder') }}
        </span>
      </div>
    </template>

    <template v-slot:footer>
      <div v-if="tags.length > 0" class="footer d-flex flex-row pt-6">
        <div
          class="competence d-flex flex-column align-start pa-4"
          v-for="block in [
            {
              title: $t('components.profile.about.general'),
              items: tags,
            },
            {
              title: $t('components.profile.about.technical'),
              items: tags,
            },
          ]"
        >
          <span class="title">{{ block.title }}</span>
          <div class="d-flex flex-wrap justify-center">
            <span
              class="item d-flex justify-center align-center px-4"
              v-for="item in block.items"
              >{{ item }}</span
            >
          </div>
        </div>
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts">
const props = defineProps({
  info: {
    type: String,
    required: true,
  },
  tags: {
    type: Array as PropType<{ text: string }[]>,
    default: () => [],
  },
});

const { info, tags } = toRefs(props);
</script>

<style scoped lang="scss">
.info {
  text-align: justify;
  text-justify: inter-word;
  align-self: stretch;
  color: #5d6872;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}
.footer {
  gap: 24px;

  .competence {
    gap: 16px;
    border-radius: 8px;
    border: 1px solid #eaeef1;

    .title {
      color: #5d6872;
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
    }

    div {
      gap: 8px;
      .item {
        font-size: 14px;
        font-weight: 400;
        color: #5d6872;
        padding-block: 10px;
        gap: 4px;
        border-radius: 99px;
        border: 1px solid #5d6872;
      }
    }
  }
}
</style>
