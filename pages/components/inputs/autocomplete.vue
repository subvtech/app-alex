<template>
  <v-container
    class="page rounded-lg bg-white pa-8 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Autocomplete</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-inputs-autocomplete</strong>
      é um componente que utiliza a estrutura do Vuetify para criar um campo de
      texto com opções.
    </p>
    <div class="d-flex align-center container rounded-lg pa-4">
      <img class="align-self-stretch" src="@/assets/svg/vuetify.svg" />
      <div>
        <p class="text-body-1 text-primary align-self-stretch">
          Esse componente utiliza a estrutura do Vuetify, acesse ele a partir
          desse link e veja mais informações.<br />
        </p>
        <a
          class="text-decoration-underline text-blue"
          href="https://vuetifyjs.com/en/components/autocompletes/#usage"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <div>
      <p class="text-subtitle-2 text-gray-500">
        O componente não requer nenhuma propriedade especifica, apenas o v-model
        e o name.<br />todas as suas propriedades são herdadas do
        <a
          class="text-decoration-underline text-blue"
          href="https://vuetifyjs.com/en/api/v-autocomplete/"
          target="_blank"
          >v-autocomplete</a
        >, também poderá ser passado um schema para validação individual.
      </p>
    </div>
    <div class="d-flex w-100 justify-space-evenly flex-column flex-sm-row">
      <div class="w-100">
        <p class="text-h5 text-center">Props do componente</p>
        <v-table variant="outline">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th>Tipo</th>
              <th>Obrigatório</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>schema</td>
              <td>YupSchema</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <alex-inputs-autocomplete
      v-model="selectedItem"
      v-model:search="search"
      name="convite"
      :schema="schema"
      :items="[
        'Joanderson',
        'Robert',
        'Zignago',
        'Eliezir',
        'Cris',
        'Angelo',
        'Berta',
        'Breno',
        'Luiz',
      ]"
      placeholder="Selecione o usuário"
      class="w-100"
      required
      hint="Nome do integrante deve conter no mínimo X caracteres"
      persistent-hint
      clearable
      info="Insira o nome do integrante"
      label="Buscar usuário"
    />

    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="activeExampleTabs[0]"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="activeExampleTabs[0]" class="w-100">
        <v-window-item value="1">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{ exampleTemplates[0] }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(exampleTemplates[0], 'firstTemplate')"
            >
              <v-icon
                v-if="copiedValue == 'firstTemplate'"
                size="x-large"
                icon="mdi-clipboard-check-multiple-outline"
                color="green-lighten-1"
              />
              <v-icon v-else size="x-large" icon="mdi-content-copy" />
            </v-btn>
          </div>
        </v-window-item>
        <v-window-item value="2">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{
                ` 
&lt;script setup&gt;
${exampleScript[0]}
&lt;/script&gt;
            `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(exampleScript[0], 'firstScript')"
            >
              <v-icon
                v-if="copiedValue == 'firstScript'"
                size="x-large"
                icon="mdi-clipboard-check-multiple-outline"
                color="green-lighten-1"
              />
              <v-icon v-else size="x-large" icon="mdi-content-copy" />
            </v-btn>
          </div>
        </v-window-item>
      </v-window>
    </div>
    <h2 class="text-h3 text-gray-800">Component Playground</h2>
    <p class="text-subtitle-2 text-gray-500">
      Aqui você pode testar algumas das propriedades do componente e ver como
      elas se comportam.
    </p>
    <v-row class="w-100 d-flex align-center">
      <v-col cols="12" md="7">
        <alex-inputs-autocomplete
          name="example"
          :clearable="playgroundOptions[0]"
          :disabled="playgroundOptions[2]"
          :error-messages="
            playgroundOptions[1] ? 'Mensagem de erro' : undefined
          "
          :persistent-hint="playgroundOptions[3]"
          hint="Mensagem de ajuda"
          :placeholder="playgroundValues[0]"
          :prepend-inner-icon="playgroundValues[1]"
          :append-inner-icon="playgroundValues[2]"
          :density="playgroundDensities"
          :label="playgroundValues[3]"
          :required="playgroundOptions[4]"
          info="Mensagem de informação"
        />
      </v-col>
      <v-col class="playground-controls pa-3 d-flex flex-column">
        <alex-inputs-text-field
          v-model="playgroundValues[0]"
          name="placeholder"
          hide-details
          placeholder="Nome de usuário"
          label="Placeholder"
          clearable
        />
        <alex-inputs-text-field
          v-model="playgroundValues[1]"
          name="preprend"
          hide-details
          placeholder="mdi-account"
          label="Prepend Icon"
          clearable
        />
        <alex-inputs-text-field
          v-model="playgroundValues[2]"
          name="append"
          hide-details
          placeholder="mdi-close"
          label="Append Icon"
          clearable
        />
        <alex-inputs-text-field
          v-model="playgroundValues[3]"
          name="label"
          hide-details
          placeholder="User Name"
          label="Label"
          clearable
        />
        <div class="d-flex flex-wrap">
          <v-checkbox
            v-model="playgroundOptions[0]"
            :hide-details="true"
            label="clearable"
            color="primary"
          />
          <v-checkbox
            v-model="playgroundOptions[1]"
            :hide-details="true"
            label="error"
            color="error"
          />
          <v-checkbox
            v-model="playgroundOptions[2]"
            :hide-details="true"
            label="disabled"
            color="gray-400"
          />
          <v-checkbox
            v-model="playgroundOptions[3]"
            :hide-details="true"
            label="persistent-hint"
            color="accent"
          />
          <v-checkbox
            v-model="playgroundOptions[4]"
            :hide-details="true"
            label="required"
            color="info"
          />
        </div>
        <alex-inputs-select
          v-model="playgroundDensities"
          name="density"
          class="playground-select"
          :items="['default', 'comfortable', 'compact']"
          label="Density"
          color="accent"
          variant="outlined"
          persistent-hint
          :hint="
            playgroundDensities == 'default'
              ? 'Default (Input H = 56px)'
              : playgroundDensities == 'comfortable'
              ? 'Comfortable (Input H = 50px)'
              : 'Compact (Input H = 44px)'
          "
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const selectedItem = ref();
const schema = yup.string().nonNullable().required('this field is required');
const search = ref('');
const copiedValue = ref('');
const activeExampleTabs = ref(['1']);
const playgroundOptions = ref([false, false, false, false, false]);
const playgroundValues = ref(['', '', '', 'User Name']);
const playgroundDensities = ref('default');
const exampleTemplates = [
  `    <alex-inputs-autocomplete
      name="convite"
      placeholder="Buscar Integrante"
      :items="[
        'Joanderson',
        'Robert',
        'Zignago',
        'Eliezir',
        'Cris',
        'Angelo',
        'Berta',
        'Breno',
        'Luiz',
      ]"
      class="w-100"
      hint="Nome do integrante deve conter no mínimo X caracteres"
      required
      persistent-hint
      clearable
      info="Insira o nome do integrante"
      label="Quem participará?"
    />
`,
];

const exampleScript = [`const inputText = ref('');`];

const exampleTabs = [
  {
    label: 'Template',
    value: '1',
  },
  {
    label: 'Script',
    value: '2',
  },
];

const copyToClipboard = async (message, item) => {
  try {
    await navigator.clipboard.writeText(message);
    copiedValue.value = item;
  } catch (err) {
    copiedValue.value = item;
  }
};
</script>

<style>
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
  right: 24px;
  top: 24px;
  color: #a0a8b1;
}

.playground-controls {
  border-left: 1px solid #a0a8b7;
  gap: 16px;
}
</style>
