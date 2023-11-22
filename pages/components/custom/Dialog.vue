<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Dialog</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-dialog</strong>
      é um pop up que serve pra atrair a atenção do usuário.
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
          href="https://vuetifyjs.com/en/components/dialog/"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h2 text-gray-800">Uso Básico</h2>
    <p class="text-subtitle-2 text-gray-500">
      Todas as propriedades são opcionais com exceção do title. Ela herda todas
      as propriedades de
      <strong>v-dialog</strong>
    </p>
    <div class="pa-4">
      <p class="text-subtitle-2 text-gray-500">
        Esse é o modelo mais simples, passado apenas o title, o botão é exibido
        mas ele não funciona
      </p>
    </div>
    <div class="w-100 flex-column d-flex">
      <alex-custom-dialog title="exemplo 1" />
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
      Precisa adiciona o model <strong>isActive</strong> e função de
      <strong>toggleDialog</strong>.
    </p>
    <alex-custom-dialog
      title="exemplo 2"
      :toggleDialog="() => (model1 = !model1)"
      :isActive="model1"
    />
    <div class="w-100" style="position: relative">
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

    <p class="text-subtitle-2 text-gray-500">
      É possível selecionar a variant dos btns dentro do dialog
    </p>

    <div class="w-100">
      <alex-custom-dialog
        title="exemplo 3"
        :toggleDialog="() => (model2 = !model2)"
        :isActive="model2"
        :btnVariant="'outlined'"
      />
      <div class="px-3" style="position: relative">
        <prism>{{ examples[2] }}</prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(2)"
        >
          <v-icon
            v-if="copiedIndex === 2"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <p class="text-subtitle-2 text-gray-500">
      Existe o slot <strong>activator</strong> na qual se pode substituir o
      botão que ativar o dialog. É necessário setar
      <strong>overwrite-activator</strong> para true.
    </p>

    <div class="w-100">
      <alex-custom-dialog
        title="exemplo 4"
        :toggleDialog="() => (model3 = !model3)"
        :isActive="model3"
        :btnVariant="'outlined'"
        overwrite-activator
        ><template v-slot:activator>
          <v-btn @click="() => (model3 = !model3)">123</v-btn>
        </template></alex-custom-dialog
      >
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
      Existe o slot <strong>default</strong> na qual se pode substituir o dialog
      inteiro. É necessário setar <strong>overwrite-default</strong> para true.
    </p>

    <div class="w-100">
      <alex-custom-dialog
        title="exemplo 5"
        :toggleDialog="() => (model4 = !model4)"
        :isActive="model4"
        :btnVariant="'outlined'"
        overwrite-default
        ><template v-slot:default>
          <v-btn @click="() => (model4 = !model4)">new dialog</v-btn>
        </template></alex-custom-dialog
      >
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
      Para adicionar conteúdo sem sobrescrever o header e o footer é necessário
      usar o slot <strong>content</strong>
    </p>
    <alex-custom-dialog
      title="exemplo 6"
      :toggleDialog="() => (model5 = !model5)"
      :isActive="model5"
      :btnVariant="'text'"
    >
      <template v-slot:content>
        <span>This is a test</span>
      </template>
    </alex-custom-dialog>

    <div class="w-100">
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
      Existe a propriedade <strong>extraPadding</strong> que torna o dialog um
      pouco maior
    </p>
    <alex-custom-dialog
      title="exemplo 7"
      :toggleDialog="() => (model6 = !model6)"
      :isActive="model6"
      :btnVariant="'text'"
      extra-padding
    />

    <div class="w-100">
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
        <alex-custom-dialog
          title="exemplo completo"
          :toggleDialog="() => (model7 = !model7)"
          :isActive="model7"
          :btnVariant="'text'"
          prepend-Icon
          extra-padding
          ><template v-slot:content>
            <div>
              <v-icon>mdi-account</v-icon>
              <span>final test</span>
            </div>
          </template>
        </alex-custom-dialog>
        <div class="px-3" style="position: relative">
          <prism>{{ examples[7] }}</prism>
          <v-btn
            class="copy-icon"
            variant="text"
            color="gray-400"
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
    <h2 class="text-h3 text-gray-800">Eventos disponíveis</h2>
    <div class="d-flex flex-column w-100" style="gap: 8px">
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

const model1 = ref(false);
const model2 = ref(false);
const model3 = ref(false);
const model4 = ref(false);
const model5 = ref(false);
const model6 = ref(false);
const model7 = ref(false);

const copiedValue = ref('');
const copiedIndex = ref(-1);
const examples = [
  `<alex-custom-dialog
        title="exemplo-1"
      />`,
  `<alex-custom-dialog
      title="exemplo-2"
      :toggleDialog="() => model = !model"
      :isActive="model"
    />
   `,
  `  <alex-custom-dialog
        title="exemplo-3"
        :toggleDialog="() => model = !model"
        :isActive="model"
        :btnVariant="'outlined'"
      />
   `,
  `<alex-custom-dialog
        title="exemplo-4"
        :toggleDialog="() => (model = !model)"
        :isActive="model"
        :btnVariant="'outlined'"
        overwrite-activator
        ><template v-slot:activator>
          <v-btn @click="() => (model = !model)">123</v-btn>
        </template></alex-custom-dialog
      >`,
  `<alex-custom-dialog
        title="exemplo-5"
        :toggleDialog="() => (model = !model)"
        :isActive="model"
        :btnVariant="'outlined'"
        overwrite-default
        ><template v-slot:default>
          <v-btn @click="() => (model = !model)">new dialog</v-btn>
        </template></alex-custom-dialog
      >`,
  `<alex-custom-dialog
      title="exemplo 6"
      :toggleDialog="() => (model5 = !model5)"
      :isActive="model5"
      :btnVariant="'text'"
    >
      <template v-slot:content>
        <span>This is a test</span>
      </template>
    </alex-custom-dialog>`,
  `<alex-custom-dialog
        title="exemplo-6"
        :toggleDialog="() => (model = !model)"
        :isActive="model"
        extra-padding
       />`,

  `<alex-custom-dialog
          title="exemplo-7"
          :toggleDialog="() => (model = !model)"
          :isActive="model"
          :btnVariant="'text'"
          prepend-Icon
          extra-padding
        />`,

  `<alex-custom-dialog
      title="exemplo-completo"
      :toggleDialog="() => (model = !model)"
      :isActive="model"
      :btnVariant="'text'"
      prepend-Icon
      extra-padding
    ><template v-slot:content>
        <div>
          <v-icon>mdi-account</v-icon>
          <span>final test</span>
        </div>
      </template>
    </alex-custom-dialog>`,
];

const propsDocumentation = [
  {
    name: 'isActive',
    type: 'Boolean',
    default: 'false',
    description: 'É o model que define se o v-dialog é exibido',
  },
  {
    name: 'extraPadding',
    type: 'Boolean',
    default: 'false',
    description: 'Se true então a class pa-10 é aplicada no dialog',
  },
  {
    name: 'prependIcon',
    type: 'Boolean',
    default: 'false',
    description: 'Se true os botões do dialog terão icons atrelados a eles.',
  },
  {
    name: 'overwriteActivator',
    type: 'Boolean',
    default: 'false',
    description:
      'Se true permite sobrescrever o botão que ativa o dialog usando o slot activator.',
  },

  {
    name: 'overwriteDefault',
    type: 'Boolean',
    default: 'false',
    description:
      'Se true permite sobrescrever o dialog inteiro usando o slot default.',
  },

  {
    name: 'toggleDialog',
    type: '() => void',
    default: '() => {}',
    description:
      'Função do clique do botão de ativar e do de fechar o dialog. É necessário que ela altere o estado de isActive',
  },

  {
    name: 'btnVariant',
    type: 'String',
    default: 'flat',
    description: 'Define a variante dos botões do dialog.',
  },

  {
    name: 'title',
    type: 'String',
    default: 'Dialog',
    description: 'Define o título do dialog.',
  },
];

const eventsDocumentation = [
  {
    name: 'save',
    description: 'Ativar no clique do botão salvar',
  },
  {
    name: 'cancel',
    description: 'Ativar no clique do botão cancelar',
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
