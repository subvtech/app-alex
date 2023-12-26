<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Card</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-card</strong>
      é um cartão flexível que pode ser usado para exibir informações com um
      cabeçalho opcional e funcionalidades de edição. Ele usa
      <strong>alex-custom-tooltip</strong>.
    </p>

    <h2 class="text-h2 text-gray-800">Uso Básico</h2>
    <p class="text-subtitle-2 text-gray-500">
      Todas as propriedades são opcionais com exceção do title. Aqui
      ilustraremos apenas os comportamentos mais comuns.
    </p>

    <h2 class="text-h3 text-gray-800">Adicionando propriedades básicas</h2>
    <div v-for="(item, index) in documentation">
      <p class="text-subtitle-2 text-gray-500" v-html="item.text" />

      <div class="d-flex flex-column w-100">
        <div
          class="d-flex align-center rounded-lg my-2 justify-space-between bg-gray-100 w-100 px-3 rounded-t"
        >
          <alex-custom-card
            v-bind="item.props"
            @toggle:is-editing="item.props.toggleIsEditing"
            ><template #content>{{ item.props.content }}</template>
            <template #footer>{{
              item.props.footer
            }}</template></alex-custom-card
          >
        </div>
        <div class="px-3" style="position: relative">
          <prism>{{ examples[index] }}</prism>
          <v-btn
            class="copy-icon"
            variant="text"
            color="gray-400"
            @click="copyToClipboard(index)"
          >
            <v-icon
              v-if="copiedIndex === index"
              size="x-large"
              icon="mdi-clipboard-check-multiple-outline"
              color="green-lighten-1"
            />
            <v-icon v-else size="x-large" icon="mdi-content-copy" />
          </v-btn>
        </div>
      </div>
    </div>

    <h2 class="text-h2 text-gray-800">Uso Completo</h2>
    <div class="px-4 py-2 w-100 d-flex">
      <div class="w-100 bg-gray-100">
        <alex-custom-card
          class="mb-6"
          title="Uso Completo"
          :isEditing="canEdit3"
          :showIcon="canEdit3"
          @toggle:isEditing="canEdit3 = !canEdit3"
          :cancel="() => console.log('cancel')"
          :save="() => console.log('save')"
          full-width
        >
          <template #content class="pa-6">
            This is inside the content tag
          </template>
          <template #footer class="pa-6">
            This is inside the footer tag
          </template>
        </alex-custom-card>
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
        <p
          v-if="item.default"
          class="text-body-1 text-gray-800 ml-2 font-weight-bold"
        >
          Default:
          <span class="text-purple-darken-2 font-weight-regular">{{
            item.default
          }}</span>
        </p>
        <p v-else class="text-body-1 text-gray-800 ml-2 font-weight-bold">
          it's required
        </p>
      </div>
    </div>

    <h2 class="text-h3 text-gray-800">Eventos disponíveis</h2>
    <div class="d-flex flex-column" style="gap: 8px">
      <div
        class="pa-6 d-flex flex-column rounded-lg align-baseline"
        v-for="(item, index) in eventsDocumentation"
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
          parameters:
          <span class="text-red-darken-2 font-weight-regular">{{
            item.parameters
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

const copyText = useCopyText();
const copyToClipboard = async (index) => {
  try {
    copyText.copyToClipboard(examples[index]);
    copiedValue.value = examples[index];
  } catch (err) {
    copiedValue.value = examples[index];
  }
  copiedIndex.value = index;
};
const canEdit1 = ref(false);
const canEdit2 = ref(false);
const canEdit3 = ref(false);

const copiedValue = ref('');
const copiedIndex = ref(-1);
const documentation = [
  {
    text: 'Esse é o modelo mais simples, passado nenhuma propriedade a exceção do title ele exibe o card com o conteúdo vazio',
    props: {
      title: 'First example',
    },
  },
  {
    text: 'Por padrão ele não ocupa todo o width disponível, é preciso passar para mudar esse comportamento.',
    props: {
      title: 'Title',
      fullWidth: true,
    },
  },
  {
    text: "Por padrão ele exibe o ícone de editar, para esconder é necessário passar <strong>:show-icon='false'</strong> para esconder o ícone.",
    props: {
      title: 'Title',
      fullWidth: true,
      showIcon: false,
    },
  },
  {
    text: 'Para ativar o botão de editar é necessário passar uma variável para <strong>is-editing</strong> e utilizar o evento <strong>@toggle:isEditing</strong>',
    props: {
      title: 'Title',
      fullWidth: true,
      isEditing: canEdit1.value,
      toggleIsEditing: () => {
        canEdit1.value = !canEdit1.value;
      },
    },
  },
  {
    text: 'Para adicionar conteúdo é necessário usar o slot <strong>#content</strong>',
    props: {
      title: 'Using content',
      fullWidth: true,
      isEditing: canEdit2.value,
      toggleIsEditing: () => {
        canEdit2.value = !canEdit2.value;
      },
      content: 'This is inside the content tag',
    },
  },
  {
    text: 'Para adicionar abaixo do content é necessário usar o slot <strong>#footer</strong>',
    props: {
      title: 'Using Footer',
      fullWidth: true,
      isEditing: canEdit3.value,
      toggleIsEditing: () => {
        canEdit3.value = !canEdit3.value;
      },
      content: 'This is inside the content tag',
      footer: 'This is inside the footer tag',
    },
  },
];
const examples = [
  `<alex-custom-card title="Title" />`,
  `<alex-custom-card title="Title" full-width />`,
  `<alex-custom-card title="Title" full-width :show-icon="false" />`,
  `<alex-custom-card 
          title="Title"
          full-width
          :is-editing="canEdit1"
          @toggle-isEditing="canEdit1 = !canEdit1" 
    />`,
  `<alex-custom-card 
          title="Title"
          full-width
          :is-editing="canEdit2"
          @toggle-isEditing="canEdit2 = !canEdit2" 
    >
      <template #content>
          This is inside the content tag
      </template>
    </alex-custom-card>`,
  `<alex-custom-card
      class="mb-6"
      title="Uso Completo"
      :isEditing="canEdit3"
      :showIcon="canEdit3"
      @toggle:isEditing="canEdit3 = !canEdit3"
      :cancel="() => console.log('cancel')"
      :save="() => console.log('save')"
      full-width
    >
      <template #content class="pa-6">
        This is inside the content tag
      </template>
      <template #footer class="pa-6">
        This is inside the footer tag
      </template>
    </alex-custom-card>`,
];

const propsDocumentation = [
  {
    name: 'title',
    type: 'String',
    description: 'Título do cartão.',
  },
  {
    name: 'fullWidth',
    type: 'Boolean',
    default: 'false',
    description: 'Define a largura do cartão como 100%.',
  },
  {
    name: 'cancel',
    type: 'Function',
    default: '() => {}',
    description: 'Função chamada ao clicar no botão de cancelar.',
  },
  {
    name: 'save',
    type: 'Function',
    default: '() => {}',
    description: 'Função chamada ao clicar no botão de salvar.',
  },
  {
    name: 'isEditing',
    type: 'Boolean',
    default: 'false',
    description: 'Indica se o cartão está no modo de edição.',
  },
  {
    name: 'hideDividers',
    type: 'Boolean',
    default: 'false',
    description: 'Oculta as linhas divisoras no cabeçalho.',
  },
  {
    name: 'noHeader',
    type: 'Boolean',
    default: 'false',
    description: 'Remove o cabeçalho do cartão.',
  },
  {
    name: 'sizingClass',
    type: 'String',
    description: 'Classe de dimensionamento para o cartão.',
  },
  {
    name: 'tooltipExtraClass',
    type: 'String',
    description: 'Classe extra para o tooltip.',
  },
  {
    name: 'alignContent',
    type: 'String',
    description: 'Alinhamento do conteúdo no cartão.',
  },
  {
    name: 'href',
    type: 'String',
    description: 'URL para redirecionar ao clicar no título.',
  },
  {
    name: 'showIcon',
    type: 'Boolean',
    default: 'true',
    description: 'Exibe ou oculta o ícone de lápis para editar.',
  },
  {
    name: 'showTooltip',
    type: 'Boolean',
    default: 'false',
    description: 'Exibe ou oculta o tooltip no título.',
  },
  {
    name: 'smallButtons',
    type: 'Boolean',
    default: 'false',
    description: 'Define o tamanho dos botões como pequeno.',
  },
  {
    name: 'tooltip',
    type: 'String',
    description: 'Texto exibido no tooltip.',
  },
  {
    name: 'isNested',
    type: 'Boolean',
    default: 'false',
    description: 'Indica se o cartão está aninhado.',
  },
];

const eventsDocumentation = [
  {
    name: 'toggle:isEditing',
    parameters: 'None',
    description: 'Toggle para alternar o modo de edição do cartão.',
  },
];
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
