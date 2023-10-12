<template>
  <profile-card
    class="mt-6"
    :title="$t('components.profile.wallets.title')"
    :full-width="false"
  >
    <template v-slot:content>
      <div class="item d-flex justify-space-between">
        <div class="label d-flex align-center">
          <div v-if="wallet" class="tooltip-box">
            <span class="tooltiptext">{{ wallet.address }}</span>
          </div>
          <img src="/images/metamask.png" alt="" />
          <span>{{ $t('components.profile.wallets.metamask') }}</span>
        </div>
        <v-btn
          class="btn ml-2"
          variant="outlined"
          size="large"
          color="#5D6872"
          @click="handleClick"
          :text="
            isWalletLinked
              ? $t('components.profile.wallets.unlink')
              : $t('components.profile.wallets.link')
          "
        />

        <v-btn
          class="btn small ml-2"
          :class="isWalletLinked ? 'unlink' : ''"
          variant="outlined"
          size="large"
          color="#5D6872"
          @click="handleClick"
        >
          <div v-if="wallet" class="tooltip-box">
            <span class="tooltiptext">{{ wallet.address }}</span>
          </div>
          <img src="/images/metamask.png" alt="" /><span>
            {{
              isWalletLinked
                ? $t('components.profile.wallets.unlink')
                : $t('components.profile.wallets.link')
            }}
          </span></v-btn
        >
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts">
const { delete: _delete } = useStrapi();

const loading = ref(false);

const { linkWallet } = useMetamask(loading);

const emit = defineEmits(['update:user']);

const messageStore = useMessageStore();

type Wallet = {
  address: string;
  id: number;
};

const props = defineProps({
  wallet: {
    type: Object as PropType<Wallet>,
  },
  id: {
    type: Number,
    required: true,
  },
});

const { wallet } = toRefs(props);

const isWalletLinked = ref(
  props.wallet ? (props.wallet.address ? true : false) : false,
);

const handleClick = async () => {
  try {
    if (isWalletLinked.value) {
      await _delete('user-wallets', props.wallet?.id);

      isWalletLinked.value = false;
    } else {
      const result = await linkWallet(props.id);
      wallet!.value = { id: result.wallet.id, address: result.wallet.address };
      isWalletLinked.value = true;
    }
  } catch (err) {
    messageStore.message = err as string;
    messageStore.show = true;
    messageStore.color = 'red';
  }

  emit('update:user', {});
};
</script>

<style scoped lang="scss">
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

  .btn {
    background-color: #eaeef1;
    border: none;
    text-transform: none !important;
  }

  .small {
    display: none;
  }
}
@media (max-width: 420px) {
  .item {
    flex-direction: column;
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
    .btn {
      display: none;
    }

    .small {
      display: block;
      img {
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
