<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Breadcrumbs</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-breadcrumbs</strong>
      é projetado para exibir um header de trilha de rotas, facilitando a
      navegação.
    </p>
    <div class="d-flex align-center pa-4 container rounded-lg">
      <img class="align-self-stretch" src="@/assets/svg/vuetify.svg" />
      <div>
        <p class="text-body-1 text-primary align-self-stretch">
          Esse componente utiliza a estrutura do Vuetify, acesse ele a partir
          desse link e veja mais informações.<br />
        </p>
        <a
          class="text-decoration-underline text-blue"
          href="https://vuetifyjs.com/en/components/breadcrumbs/"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h2 text-gray-800">Uso Básico</h2>
    <p class="text-subtitle-2 text-gray-500">
      Todas as propriedades são opcionais.
    </p>
    <div class="pa-4">
      <p class="text-subtitle-2 text-gray-500">
        Esse é o modelo mais simples, passado nenhuma propriedade ele não exibe
        nada.
      </p>
    </div>
    <div class="w-100 d-flex">
      <div
        class="d-flex my-2 rounded-lg align-center justify-space-between bg-gray-100 w-100 px-3 rounded-t"
      >
        <alex-custom-breadcrumbs />
      </div>
      <div class="px-3 w-100" style="position: relative">
        <prism> {{ examples[0] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(0)"
        >
          <v-icon
            v-if="copiedIndex === 0"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <h2 class="text-h3 text-gray-800">Adicionando propriedades básicas</h2>
    <p class="text-subtitle-2 text-gray-500">
      Vamos definir o título, e alguns items.
    </p>

    <div class="w-100">
      <div
        class="d-flex align-center rounded-lg my-2 justify-space-between bg-gray-100 w-100 px-3 rounded-t"
      >
        <alex-custom-breadcrumbs
          title="John Doe"
          :items="[
            { disabled: false, title: 'text', href: '/' },
            { disabled: false, title: 'fext2', href: '/dsd' },
          ]"
        />
      </div>
      <div class="px-3" style="position: relative">
        <prism>{{ examples[1] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(1)"
        >
          <v-icon
            v-if="copiedIndex === 1"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <p class="text-subtitle-2 text-gray-500">
      É possível alterar a cor do background
    </p>

    <div class="w-100">
      <div
        class="d-flex align-center rounded-lg my-2 justify-space-between bg-gray-100 w-100 px-3 rounded-t"
      >
        <alex-custom-breadcrumbs
          title="John Doe"
          background-color="#abb2b9"
          :items="[
            { disabled: false, title: 'text', href: '/' },
            { disabled: false, title: 'fext2', href: '/dsd' },
          ]"
        />
      </div>
      <div class="px-3" style="position: relative">
        <prism>{{ examples[3] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(3)"
        >
          <v-icon
            v-if="copiedIndex === 3"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <p class="text-subtitle-2 text-gray-500">
      É possível alterar a espessura da divisória com
      <strong>thickness</strong>, o valor padrão é 2
    </p>

    <div class="w-100">
      <div
        class="d-flex align-center rounded-lg my-2 justify-space-between bg-gray-100 w-100 px-3 rounded-t"
      >
        <alex-custom-breadcrumbs
          title="John Doe"
          titleStyle="color: #000"
          :thickness="5"
          :items="[
            { disabled: false, title: 'text1', href: '/' },
            { disabled: true, title: 'text', href: '/dsd' },
          ]"
        />
      </div>
      <div class="px-3" style="position: relative">
        <prism>{{ examples[4] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(4)"
        >
          <v-icon
            v-if="copiedIndex === 4"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <p class="text-subtitle-2 text-gray-500">
      É possível alterar a símbolo da divisória com
      <strong>divider</strong>, o valor padrão é '>'
    </p>

    <div class="w-100">
      <div
        class="d-flex align-center rounded-lg my-2 justify-space-between bg-gray-100 w-100 px-3 rounded-t"
      >
        <alex-custom-breadcrumbs
          title="John Doe"
          titleStyle="color: #000"
          divider="@"
          :thickness="3"
          :items="[
            { disabled: false, title: 'text1', href: '/' },
            { disabled: true, title: 'text', href: '/dsd' },
          ]"
        />
      </div>
      <div class="px-3" style="position: relative">
        <prism>{{ examples[5] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(5)"
        >
          <v-icon
            v-if="copiedIndex === 5"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <p class="text-subtitle-2 text-gray-500">
      É possível alterar sobrescrever o styling e o divider setando
      <strong>overwriteDivider</strong> para true. fazendo isso o slot divider
      fica disponível para uso
    </p>

    <div class="w-100">
      <div
        class="d-flex align-center rounded-lg my-2 justify-space-between bg-gray-100 w-100 px-3 rounded-t"
      >
        <alex-custom-breadcrumbs
          title="John Doe"
          titleStyle="color: #000"
          divider="@"
          overwrite-divider
          :thickness="3"
          :items="[
            { disabled: false, title: 'text1', href: '/' },
            { disabled: true, title: 'text', href: '/dsd' },
            { disabled: false, title: 'text4', href: '/' },
            { disabled: true, title: 'text3', href: '/dsd' },
          ]"
        >
          <template v-slot:divider>
            <span class="font-weight-bold" style="color: blueviolet">32</span>
          </template>
        </alex-custom-breadcrumbs>
      </div>
      <div class="px-3" style="position: relative">
        <prism>{{ examples[6] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(6)"
        >
          <v-icon
            v-if="copiedIndex === 6"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <h2 class="text-h2 text-gray-800">Uso Completo</h2>
    <div class="px-4 py-2 w-100 d-flex">
      <div class="w-100 bg-gray-100">
        <alex-custom-breadcrumbs
          title="John Doe"
          arrow-back
          background-color="#9ffe9b"
          title-style="color: red"
          :thickness="3"
          :divider="'-'"
          breadcrumbs-v-classes="pt-2 flex-wrap"
          item-style="font-size: 18px; !important"
          :items="[
            { disabled: true, title: 'text', href: '/' },
            { disabled: false, title: 'fext2', href: '/dsd' },
            { disabled: true, title: 'text', href: '/' },
          ]"
        />
        <div class="px-3" style="position: relative">
          <prism>{{ examples[7] }}</prism>
          <v-btn
            class="copy-icon"
            variant="text"
            color="red-400"
            @click="copyToClipboard(7)"
          >
            <v-icon
              v-if="copiedIndex === 7"
              size="x-large"
              icon="mdi-clipboard-check-multiple-outline"
              color="green-lighten-1"
            />
            <v-icon v-else size="x-large" icon="mdi-content-copy" />
          </v-btn>
        </div>
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Propriedades disponíveis</h2>
    <div class="d-flex flex-column" style="gap: 8px">
      <div
        class="pa-6 d-flex flex-column rounded-lg align-baseline"
        v-for="(item, index) in propsDocumentation"
        :style="
          index % 2 === 0
            ? 'background-color: #EBEDEF'
            : 'background-color: #D1F6FA'
        "
      >
        <p class="text-subtitle-2 text-gray-500">{{ item.name }}</p>

        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          Descrição:
          <span class="font-weight-regular">{{ item.description }}</span>
        </p>
        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          Type:
          <span class="text-red-darken-2 font-weight-regular">{{
            item.type
          }}</span>
        </p>
        <p class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          Default:
          <span class="text-purple-darken-2 font-weight-regular">{{
            item.default
          }}</span>
        </p>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const copiedValue = ref('');
const copiedIndex = ref(-1);
const examples = [
  `<alex-custom-breadcrumbs />`,
  `<alex-custom-breadcrumbs
    title="John Doe"
    :items="[
          { disabled: false, title: 'text', href: '/' },
          { disabled: false, title: 'fext2', href: '/dsd' },
        ]",
    />`,
  `<alex-custom-breadcrumbs
    :arrow-back="false"
    :items="[
      { disabled: false, title: 'text', href: '/' },
      { disabled: false, title: 'text2', href: '/' },
    ]"
    />
     `,
  `<alex-custom-breadcrumbs
      title="John Doe"
      background-color="#abb2b9"
      :items="[
        { disabled: false, title: 'text', href: '/' },
        { disabled: false, title: 'fext2', href: '/dsd' },
      ]"
    /> `,
  ` <alex-custom-breadcrumbs
      title="John Doe"
      background-color="#abb2b9"
      :thickness="5"
      :items="[
        { disabled: false, title: 'text1', href: '/' },
        { disabled: true, title: 'text', href: '/dsd' },
      ]"
    />`,
  `<alex-custom-breadcrumbs
      title="John Doe"
      titleStyle="color: #000"
      divider="@"
      :thickness="3"
      :items="[
        { disabled: false, title: 'text1', href: '/' },
        { disabled: true, title: 'text', href: '/dsd' },
      ]"
    />`,
  `<alex-custom-breadcrumbs
      title="John Doe"
      titleStyle="color: #000"
      divider="@"
      overwrite-divider
      :thickness="3"
      :items="[
        { disabled: false, title: 'text1', href: '/' },
        { disabled: true, title: 'text', href: '/dsd' },
        { disabled: false, title: 'text4', href: '/' },
        { disabled: true, title: 'text3', href: '/dsd' },
      ]"
    >
      <template v-slot:divider>
        <span class="font-weight-bold" style="color: blueviolet">32</span>
      </template>
    </alex-custom-breadcrumbs>`,
  `<alex-custom-breadcrumbs
      title="John Doe"
      :arrow-back="false"
      background-color="#9ffe9b"
      title-style="color: red"
      breadcrumbsVClasses="pt-2 flex-wrap"
      :thickness="3"
      :divider="'-'"
      item-style="font-size: 18px; !important"
      :items="[
        { disabled: true, title: 'text', href: '/' },
        { disabled: false, title: 'fext2', href: '/dsd' },
        { disabled: true, title: 'text', href: '/' },
      ]"
    />`,
];

const propsDocumentation = [
  {
    name: 'items',
    type: '{ title: string; disabled: boolean; href: string }[]',
    default: '[]',
    description: 'O array de items a ser exibido.',
  },
  {
    name: 'arrowBack',
    type: 'Boolean',
    default: 'true',
    description: 'Define se o arrow back é exibido ou não.',
  },
  {
    name: 'title',
    type: 'String',
    default: 'undefined',
    description: 'O título que é exibido.',
  },
  {
    name: 'thickness',
    type: 'Number',
    default: '2',
    description: 'A espessura da divisória.',
  },

  {
    name: 'divider',
    type: 'String',
    default: '>',
    description: 'Específica o símbolo da divisória',
  },

  {
    name: 'titleStyle',
    type: 'String',
    default: 'undefined',
    description: 'Extra css para o title',
  },
  {
    name: 'breadcrumbsVClasses',
    type: 'String',
    default: 'flex-wrap',
    description:
      'Permite aplicar classes auxiliares do vuetify diretamente no componente v-breadcrumbs, útil para definir alinhamentos',
  },
  {
    name: 'itemStyle',
    type: 'String',
    default: 'undefined',
    description: 'Extra css para o item',
  },
  {
    name: 'overwriteDivider',
    type: 'Boolean',
    default: 'false',
    description: 'sobrescreve o dividr padrão e libera acesso ao slot divider',
  },
];

const copyToClipboard = async (index) => {
  try {
    await navigator.clipboard.writeText(examples[index]);
    copiedValue.value = examples[index];
  } catch (err) {
    copiedValue.value = examples[index];
  }
  copiedIndex.value = index;
};
</script>

<style>
.language-markup {
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
  border-radius: 8px;
}
.container {
  border: 1px solid #a0a8b1;
  gap: 16px;
  align-self: stretch;
}

.align-self-stretch {
  align-self: stretch;
}

.page {
  max-width: 1200px;
  gap: 40px;
}

.copy-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #a0a8b1;
}
</style>
