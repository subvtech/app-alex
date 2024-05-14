<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Chip</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-custom-chip</strong>
      um componente que serve para exibir uma informação e também pode servir
      como um botão.
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
          href="https://vuetifyjs.com/en/components/chip/"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h2 text-gray-800">Uso Básico</h2>
    <p class="text-subtitle-2 text-gray-500">
      Todas as propriedades são opcionais. Ela herda todas as propriedades de
      <strong>v-chip</strong>
    </p>
    <div class="pa-4">
      <p class="text-subtitle-2 text-gray-500">
        Esse é o modelo mais simples, apenas texto ou apenas o ícone.
      </p>
    </div>
    <div class="w-100 flex-column d-flex">
      <div class="d-flex" style="gap: 8px">
        <alex-custom-chip text="text" />
        <alex-custom-chip icon="mdi-bookmark" />
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

    <h2 class="text-h3 text-gray-800">Tamanhos</h2>

    <p class="text-subtitle-2 text-gray-500">
      Com a propriedade size se controla o tamanho do chips
    </p>
    <div class="w-100 d-flex" style="gap: 8px">
      <alex-custom-chip text="large" :size="'large'" />
      <alex-custom-chip text="medium" :size="'medium'" />
      <alex-custom-chip text="small" :size="'small'" />
      <alex-custom-chip text="x-small" :size="'x-small'" />
    </div>

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

    <h2 class="text-h3 text-gray-800">Cores</h2>

    <p class="text-subtitle-2 text-gray-500">
      Com a propriedade color se controla as cores do chips, a cor reflete a cor
      do texto, o background é um shade da cor escolhida
    </p>
    <div class="w-100 d-flex flex-wrap" style="gap: 8px">
      <alex-custom-chip text="#000000" :color="'#000000'" />
      <alex-custom-chip text="#6E7A87" :color="'#6E7A87'" />
      <alex-custom-chip text="#156A3B" :color="'#156A3B'" />
      <alex-custom-chip text="#B61617" :color="'#B61617'" />
      <alex-custom-chip text="#32DA3B" :color="'#32DA3B'" />
      <alex-custom-chip text="#444857" :color="'#444857'" />
      <alex-custom-chip text="#CC6400" :color="'#CC6400'" />
      <alex-custom-chip text="#dd58ad" :color="'#dd58ad'" />
      <alex-custom-chip text="#005C66" :color="'#005C66'" />
    </div>

    <h2 class="text-h3 text-gray-800">Status</h2>

    <p class="text-subtitle-2 text-gray-500">
      Com a propriedade <strong>status</strong> se define um estilo que
      sobrescreve color
    </p>
    <div class="w-100 d-flex flex-wrap" style="gap: 8px">
      <alex-custom-chip text="primary" :status="'primary'" />
      <alex-custom-chip text="secondary" :status="'secondary'" />
      <alex-custom-chip text="blue" :status="'blue'" />
      <alex-custom-chip text="red" :status="'red'" />
      <alex-custom-chip text="green" :status="'green'" />
      <alex-custom-chip text="orange" :status="'orange'" />
    </div>
    <div class="w-100" style="position: relative">
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
    <h2 class="text-h3 text-gray-800">Outlined</h2>

    <p class="text-subtitle-2 text-gray-500">
      Com a propriedade <strong>Variant</strong> podemos alterar o estilo do
      chip
    </p>
    <div class="w-100 d-flex flex-wrap" style="gap: 8px">
      <alex-custom-chip text="primary" :status="'primary'" variant="outlined" />
      <alex-custom-chip
        text="secondary"
        :status="'secondary'"
        variant="outlined"
      />

      <alex-custom-chip text="blue" :status="'blue'" variant="outlined" />
      <alex-custom-chip text="red" :status="'red'" variant="outlined" />
      <alex-custom-chip text="green" :status="'green'" variant="outlined" />
      <alex-custom-chip text="orange" :status="'orange'" variant="outlined" />
    </div>

    <div class="w-100" style="position: relative">
      <prism>{{ examples[8] }}</prism>
      <v-btn
        class="copy-icon"
        variant="text"
        color="gray-400"
        @click="copyToClipboard(8)"
      >
        <v-icon
          v-if="copiedIndex === 8"
          size="x-large"
          icon="mdi-clipboard-check-multiple-outline"
          color="green-lighten-1"
        />
        <v-icon v-else size="x-large" icon="mdi-content-copy" />
      </v-btn>
    </div>

    <h2 class="text-h3 text-gray-800">Disabled</h2>

    <p class="text-subtitle-2 text-gray-500">
      Com a propriedade <strong>Disabled</strong> podemos desabilitar o o chip
    </p>
    <div class="w-100 d-flex flex-wrap" style="gap: 8px">
      <alex-custom-chip
        text="primary"
        :status="'primary'"
        variant="outlined"
        disabled
      />
      <alex-custom-chip
        text="secondary"
        :status="'secondary'"
        variant="outlined"
        disabled
      />
      <alex-custom-chip text="primary" :status="'primary'" disabled />
      <alex-custom-chip text="secondary" :status="'secondary'" disabled />
      <alex-custom-chip text="primary" :status="'primary'" disabled clickable />
      <alex-custom-chip
        text="secondary"
        :status="'secondary'"
        disabled
        clickable
      />
    </div>

    <div class="w-100" style="position: relative">
      <prism>{{ examples[9] }}</prism>
      <v-btn
        class="copy-icon"
        variant="text"
        color="gray-400"
        @click="copyToClipboard(9)"
      >
        <v-icon
          v-if="copiedIndex === 9"
          size="x-large"
          icon="mdi-clipboard-check-multiple-outline"
          color="green-lighten-1"
        />
        <v-icon v-else size="x-large" icon="mdi-content-copy" />
      </v-btn>
    </div>
    <h2 class="text-h3 text-gray-800">Clickable</h2>

    <p class="text-subtitle-2 text-gray-500">
      Com a propriedade <strong>Clickable</strong> podemos deixa o chip clicável
    </p>
    <div class="w-100 d-flex flex-wrap" style="gap: 8px">
      <alex-custom-chip text="primary" status="primary" clickable />
      <alex-custom-chip text="secondary" status="secondary" clickable />
      <alex-custom-chip
        text="primary"
        status="primary"
        variant="outlined"
        clickable
      />
      <alex-custom-chip
        text="secondary"
        status="secondary"
        variant="outlined"
        clickable
      />
    </div>
    <h2 class="text-h3 text-gray-800">Active</h2>

    <p class="text-subtitle-2 text-gray-500">
      Com a propriedade <strong>active</strong> podemos mudar o estilo do chip
      para ativo
    </p>
    <div class="w-100 d-flex flex-wrap" style="gap: 8px">
      <alex-custom-chip text="primary" status="primary" active clickable />
      <alex-custom-chip text="secondary" status="secondary" active clickable />
      <alex-custom-chip
        text="primary"
        status="primary"
        variant="outlined"
        active
        clickable
      />
      <alex-custom-chip
        text="secondary"
        status="secondary"
        variant="outlined"
        active
        clickable
      />
    </div>
    <h2 class="text-h3 text-gray-800">Closable</h2>

    <p class="text-subtitle-2 text-gray-500">
      Com a propriedade <strong>closable</strong> podemos apagar o chip, porém
      só poderá ser utilizado com o clickable
    </p>
    <div class="w-100 d-flex flex-wrap" style="gap: 8px">
      <alex-custom-chip text="primary" status="primary" closable clickable />
      <alex-custom-chip
        text="secondary"
        status="secondary"
        closable
        clickable
      />
      <alex-custom-chip
        text="primary"
        status="primary"
        variant="outlined"
        closable
        clickable
      />
      <alex-custom-chip
        text="secondary"
        status="secondary"
        variant="outlined"
        closable
        clickable
      />
      <alex-custom-chip
        text="primary"
        status="primary"
        closable
        clickable
        active
      />
      <alex-custom-chip
        text="secondary"
        status="secondary"
        closable
        clickable
        active
      />
    </div>

    <h2 class="text-h3 text-gray-800">Icons</h2>

    <p class="text-subtitle-2 text-gray-500">
      Com a propriedade <strong>icon</strong> ele se tornar em um chip com um
      único icon
    </p>

    <div class="w-100">
      <div class="w-100 d-flex flex-wrap" style="gap: 8px">
        <alex-custom-chip icon="mdi-book" :status="'blue'" />
        <alex-custom-chip icon="mdi-book-outline" :status="'red'" />
        <alex-custom-chip icon="mdi-account-outline" :status="'secondary'" />
        <alex-custom-chip icon="mdi-book" :status="'primary'" />
        <alex-custom-chip icon="mdi-circle" :status="'green'" />
        <alex-custom-chip icon="mdi-close" :color="'#005C66'" />
        <alex-custom-chip icon="mdi-book" :color="'#156A3B'" />
        <alex-custom-chip icon="mdi-map" :color="'#B61617'" />
        <alex-custom-chip icon="mdi-book-outline" :color="'#6E7A87'" />
        <alex-custom-chip icon="mdi-book" :color="'#CC6400'" />
        <alex-custom-chip icon="mdi-pencil" :color="'#FFFFFF'" />
        <alex-custom-chip icon="mdi-box" :status="'primary'" />
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
      Com a propriedade <strong>prependIcon</strong> ele adiciona o icon
      especificado antes do texto
    </p>

    <div class="w-100">
      <div class="w-100 d-flex flex-wrap" style="gap: 8px">
        <alex-custom-chip
          text="mdi-book"
          prepend-icon="mdi-book"
          :status="'blue'"
        />
        <alex-custom-chip
          text="mdi-book-outline"
          prepend-icon="mdi-book-outline"
          :status="'red'"
        />
        <alex-custom-chip
          text="mdi-account"
          prepend-icon="mdi-account"
          :status="'primary'"
        />
        <alex-custom-chip
          text="mdi-account"
          prepend-icon="mdi-account"
          :status="'secondary'"
        />
        <alex-custom-chip
          text="mdi-box"
          prepend-icon="mdi-box"
          :status="'green'"
        />
        <alex-custom-chip
          text="mdi-close"
          prepend-icon="mdi-close"
          :color="'#001A33'"
        />
        <alex-custom-chip
          text="mdi-book"
          prepend-icon="mdi-book"
          :color="'#15693B'"
        />
        <alex-custom-chip
          text="mdi-book"
          prepend-icon="mdi-account-outline"
          :color="'#005500'"
        />
        <alex-custom-chip
          text="mdi-map"
          prepend-icon="mdi-map"
          :color="'#B61617'"
        />
        <alex-custom-chip
          text="mdi-book-outline"
          prepend-icon="mdi-book-outline"
          :color="'#BFF2D6'"
        />
        <alex-custom-chip
          text="mdi-book"
          prepend-icon="mdi-book"
          :color="'#EBEDEF'"
        />
        <alex-custom-chip
          text="mdi-pencil"
          prepend-icon="mdi-pencil"
          :color="'green'"
        />
        <alex-custom-chip
          text="mdi-box"
          prepend-icon="mdi-box"
          :color="'primary'"
        />
        <alex-custom-chip
          text="mdi-close"
          prepend-icon="mdi-close"
          :color="'secondary'"
        />
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
        <alex-custom-chip
          text="mdi-pencil"
          prepend-icon="mdi-pencil"
          status="primary"
          clickable
          closable
          active
        />
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
        v-for="(item, index) in propsDocumentation"
        :key="index"
        class="pa-6 d-flex flex-column rounded-lg align-baseline"
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
        v-for="(item, index) in eventsDocumentation"
        :key="index"
        class="pa-6 d-flex flex-column rounded-lg align-baseline"
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

const copiedValue = ref('');
const copiedIndex = ref(-1);
const examples = [
  `<alex-custom-chip text="text"/>
<alex-custom-chip icon="mdi-bookmark"/>`,
  `<alex-custom-chip text="large" :size="'large'" />
   `,
  `<alex-custom-chip text="#B61617" :color="'#B61617'" />`,
  `<alex-custom-chip text="green" :status="'green'" />`,
  `<alex-custom-chip text="green" :status="'green' clickable" />`,
  `<alex-custom-chip icon="mdi-book" :color="'#EBEDEF'" />`,
  `<alex-custom-chip text="mdi-book" predend-icon="mdi-book" :color="'#EBEDEF'" />`,
  ` <alex-custom-chip
      text="mdi-pencil"
      prepend-icon="mdi-pencil"
      clickable
      closable
      active
    />`,
  `<alex-custom-chip text="large" :size="'large'" variant="outlined" />
   `,
  ` <alex-custom-chip
        text="primary"
        :status="'primary'"
        variant="outlined"
        disabled
      />
   `,
];

const propsDocumentation = [
  {
    name: 'text',
    type: String,
    default: 'undefined',
    description: 'O texto exibido no chip',
  },
  {
    name: 'clickable',
    type: 'Boolean',
    default: 'false',
    description: 'Ativa hover, border e animações de clique,',
  },
  {
    name: 'prependIcon',
    type: 'String',
    default: 'undefined',
    description: 'Espera um mdi-icon, se definido ele exibe antes do texto.',
  },
  {
    name: 'icon',
    type: 'String',
    default: 'undefined',
    description: 'Espera um mdi-icon, se definido ele exibe substitui o texto.',
  },
  {
    name: 'size',
    type: "'x-small' | 'small' | 'medium' | 'large'",

    default: 'medium',
    description: 'Define o tamanho do chip',
  },

  {
    name: 'status',
    type: "  'primary' | 'secondary' | 'orange' | 'green' | 'red' | 'blue'",

    default: 'undefined',
    description:
      'É um estilo, se definido ele sobrescreve as propriedades variant e color',
  },

  {
    name: 'color',
    type: 'String',

    default: 'undefined',
    description:
      'É uma cor, se definido ele define uma cor para o texto, o background é um shade dessa cor.',
  },
  {
    name: 'variant',
    type: "'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'",

    default: 'outlined',
    description: 'Define a variante do chip, ele é sobrescrito pelo status',
  },
];

const eventsDocumentation = [
  {
    name: 'click:close',
    description: 'Ativa no clique do botão x',
  },
  {
    name: 'click:chip',
    description: 'Ativa no clique dentro do chip, com exceção do botão x',
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
