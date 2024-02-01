<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list :data="listProps" />
    <alex-documentation-accordions-props-list :data="listEmits" list-emits />
    <alex-documentation-example
      v-for="item in examples"
      :key="item.title"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      :has-example="item.hasExample"
    >
      <template #component>
        <alex-profile-settings-wallet :wallet="walletProps.wallet" /> </template
    ></alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PropItemType } from '~/components/alex/documentation/accordions/PropsList.vue';
import { WalletComponentType } from '~/components/alex/profile/settings/Wallet.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Card da Wallet';
const description = 'É usado para exibir informações da carteira do usuário';

const walletProps: WalletComponentType = {
  wallet: { address: 'example', id: 2 },
};

const listProps: PropItemType[] = [
  {
    name: 'wallet',
    type: 'object',
    required: true,
    description:
      "The user's wallet information, containing id and address properties.",
  },
];

const listEmits: PropItemType[] = [
  {
    name: 'update:wallet',
    type: '(walletId: number) => void',
    description:
      "It's triggered in order to link a wallet, must use useMetamask",
  },
  {
    name: 'remove:wallet',
    type: '() => void',
    description:
      "It's triggered in order to unlink a wallet, must use useMetamask",
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-settings-wallet
          :wallet="walletProps.wallet"          
          @update:wallet="linkWallet"
          @remove:wallet="unlinkWallet(userId)"
        />`,
        label: 'Template',
      },
      {
        template: `const walletProps: WalletComponentType = {
  wallet: { address: 'example', id: 2 },
};
const userId = ref(2);`,
        label: 'Script',
      },
    ],
    hasExample: true,
    title: 'Basic Usage',
    description: '',
  },
]);
</script>
