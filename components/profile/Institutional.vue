<template>
  <profile-card title="Institucional" :full-width="true">
    <template v-slot:content>
      <div class="d-flex flex-wrap items">
        <div
          class="d-flex pa-4 item"
          v-for="item in [
            {
              title: 'IFAL - Instituto Federal de Alagoas',
              description: 'Campus Maceió',
              icon: '',
            },
            {
              title: 'IFAL - Instituto Federal de Alagoas',
              description: 'Campus Maceió',
              icon: '',
            },
          ]"
        >
          <img src="https://picsum.photos/900/900" :alt="item.title" />
          <div class="d-flex flex-column">
            <span>{{ item.title }}</span>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts"></script>

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
