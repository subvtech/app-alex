<template>
  <profile-card class="mb-6" title="Sobre" :full-width="true">
    <template v-slot:content>
      <span class="info">
      {{ info }}
      </span>
    </template>

    <template v-slot:footer>
      <div class="footer d-flex flex-row pt-6">
        <div
          class="competence d-flex flex-column align-start pa-4"
          v-for="block in [
            {
              title: 'Competências Gerais',
              items: [
                'Liderança',
                'Liderança',
                'Liderança',
                'Liderança',
                'Liderança',
                'Liderança',
              ],
            },
            {
              title: 'Competências Técnicas',
              items: [
                'Inglês',
                'Inglês',
                'Inglês',
                'Inglês',
                'Inglês',
                'Inglês',
              ],
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
 
});

const { info } = toRefs(props);</script>

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
