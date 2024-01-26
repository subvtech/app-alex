<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-prop-list :data="listProps" />
    <alex-documentation-example
      v-for="item in examples"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      :has-example="item.hasExample"
    >
      <template v-slot:component>
        <alex-profile-settings-wallet
          :user-id="walletProps.userId"
          :wallet="walletProps.wallet"
        /> </template
    ></alex-documentation-example>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PropItemType } from '~/components/alex/documentation/accordions/PropList.vue';
import { WalletComponentType } from '~/components/alex/profile/settings/Wallet.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Card da Wallet';
const description = 'É usado para exibir informações da carteira do usuário';

const walletProps: WalletComponentType = {
  userId: 1,
  wallet: { address: 'example', id: 2 },
};

const listProps: PropItemType[] = [
  {
    name: 'userId',
    type: 'number',
    required: true,
    description: 'The user ID associated with the wallet.',
  },
  {
    name: 'wallet',
    type: 'object',
    required: true,
    description:
      "The user's wallet information, containing id and address properties.",
  },
];

const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<alex-profile-settings-wallet
          :user-id="walletProps.userId"
          :wallet="walletProps.wallet"
        />`,
        label: 'Template',
      },
      {
        template: `const walletProps: WalletComponentType = {
  userId: 1,
  wallet: { address: 'example', id: 2 },
};`,
        label: 'Script',
      },
    ],
    hasExample: true,
    title: 'Basic Usage',
    description: '',
  },
]);
</script>
