<template>
  <alex-custom-card
    class="max-w-250"
    :title="$t('components.profile.wallets.title')"
    :show-icon="false"
  >
    <template #content>
      <div class="item d-flex w-100 justify-space-between">
        <div class="d-flex align-center gap-4">
          <div class="label d-flex align-center">
            <img src="/images/metamask.png" alt="" />
            <span>{{ $t('components.profile.wallets.metamask') }}</span>
          </div>
          <alex-documentation-buttons-copy
            v-if="wallet"
            :text="wallet.address"
            :tooltip-text="wallet.address"
          />
        </div>

        <alex-custom-button
          class="small ml-2"
          size="large"
          :variant="buttonVariant"
          @click="handleClick"
        >
          <img class="hide mr-1" src="/images/metamask.png" alt="" /><span>
            {{
              wallet
                ? $t('components.profile.wallets.unlink')
                : $t('components.profile.wallets.link')
            }}
          </span>
        </alex-custom-button>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
export interface WalletEmits {
  (e: 'remove:wallet', walletId: number): void;
  (e: 'update:wallet'): void;
}

export interface WalletComponentType {
  wallet?: Wallet;
}

const emit = defineEmits<WalletEmits>();

const props = withDefaults(defineProps<WalletComponentType>(), {
  wallet: undefined,
});

const { wallet } = toRefs(props);

const buttonVariant = computed(() => (wallet.value ? 'error' : 'secondary'));
const handleClick = () => {
  if (wallet.value) {
    emit('remove:wallet', wallet.value.id);
  } else {
    emit('update:wallet'); // if it succeeds it updates the stored wallet
  }
};
</script>

<style scoped lang="scss">
.max-w-250 {
  max-width: 1000px;
}
.item {
  border-radius: 8px;
  .label {
    gap: 16px;
    position: relative;
    .tooltip-box {
      position: absolute;
      top: -20px;

      visibility: hidden;

      background-color: #eaebec;
      border: #828486 solid 1px;
      color: rgb(93, 104, 114);
      caret-color: rgb(93, 104, 114);
      border-radius: 2px;
      z-index: 999;
      text-transform: none;

      transition: visibility 0s;
      .tooltiptext {
        font-size: 10px;
        font-weight: 500;
        text-align: center;
        color: rgb(93, 104, 114);
        caret-color: rgb(93, 104, 114);
      }
    }

    &:hover {
      .tooltip-box {
        transition-delay: 1s;
        visibility: visible;
      }
    }

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
}
.hide {
  display: none;
}
@media (max-width: 420px) {
  .item {
    flex-direction: row-reverse;
    justify-content: center !important;
    align-items: center;

    .label {
      display: none;
      img {
        display: none;
      }
      span {
        display: none;
      }
    }

    .small {
      display: block;

      .hide {
        display: block;
        max-width: 32px;
        max-height: 32px;
      }
      .tooltip-box {
        position: absolute;
        top: -20px;
        margin-inline: auto;
        visibility: hidden;

        background-color: #eaebec;
        border: #828486 solid 1px;

        border-radius: 2px;
        z-index: 999;

        transition: visibility 0s;
        .tooltiptext {
          font-size: 10px;
          text-align: center;
        }
      }

      &:hover {
        background-color: rgb(162, 238, 187);
        .tooltip-box {
          transition-delay: 1s;
          visibility: visible;
        }
      }
    }

    .unlink {
      &:hover {
        background-color: rgb(253, 145, 145);
      }
    }
  }
}
</style>
