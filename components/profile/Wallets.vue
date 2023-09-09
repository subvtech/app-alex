<template>
  <profile-card class="mt-6" title="Carteira vinculada" :full-width="false">
    <template v-slot:content>
      <div class="item d-flex justify-space-between">
        <div class="d-flex align-center">
          <img src="../../static/images/metamask.png" alt="" />
          <span>Metamask</span>
        </div>
        <v-btn
          class="btn ml-2"
          variant="outlined"
          size="large"
          color="#5D6872"
          @click=""
          text="Desvincular"
        />
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts">
type Wallet = {
  title: string;
  address: string;
};
const props = defineProps({
  wallet: {
    type: Object as PropType<Wallet>
  },
});
</script>

<style scoped lang="scss">
.item {
  border-radius: 8px;
  div {
    gap: 16px;

    img {
      max-width: 32px;
      max-height: 32px;
    }

    span {
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
    }
  }

  .btn {
    background-color: #eaeef1;
    border: none;
    text-transform: none !important;
  }
}
</style>
