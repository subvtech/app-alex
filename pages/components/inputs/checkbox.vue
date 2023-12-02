<template>
  <v-container
    class="page rounded-lg bg-white pa-8 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Checkbox</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-inputs-checkbox</strong>
      é útil para permitir aos usuários selecionar opções múltiplas dentre um
      conjunto de escolhas. Utiliza props para inserir características em cada
      item, tornando o componente completamente personalizável.
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
          href="https://vuetifyjs.com/en/components/checkboxes/#checkboxes"
          target="_blank"
          >vuetifyjs.com</a
        >
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <p class="text-subtitle-2 text-gray-500">
      O componente recebe obrigatoriamente um array de objetos, onde cada objeto
      pode conter as propriedades <strong>keyWord</strong>,
      <strong>title</strong>, <strong>icon</strong> e
      <strong>contentData</strong>, o uso de cada uma delas vai depender do
      intuito do componente. Esse array deve ser passado para o componente
      através de um v-model.
    </p>
    <div class="d-flex w-100 justify-space-evenly flex-column flex-sm-row">
      <div>
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
              <td>modelValue</td>
              <td>Boolean | Null</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>label</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>hint</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>indeterminate</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>Readonly</td>
              <td>Boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div>
        <p class="text-h5 text-center">Exemplo</p>
        <Prism class="bg-white" language="javascript">
          {{ propsExample }}
        </Prism>
      </div>
    </div>
    <div class="d-flex flex-wrap w-100 justify-center">
      <div>
        <alex-inputs-checkbox
          v-model:model-value="checkboxOne"
          label="Checkbox 1"
          hint="False"
        />
        <alex-inputs-checkbox
          v-model:model-value="checkboxTwo"
          label="Checkbox 2"
          :hint="checkboxTwo ? 'true' : 'false'"
        />
        <alex-inputs-checkbox
          v-model:model-value="checkboxThree"
          indeterminate
          label="Checkbox 3"
          :hint="
            checkboxThree === null
              ? 'null'
              : checkboxThree === false
              ? 'false'
              : 'true'
          "
        />
      </div>
      <div>
        <alex-inputs-checkbox
          :model-value="checkboxTrue"
          disabled
          label="Checkbox 4"
          hint="Disabled"
        />
        <alex-inputs-checkbox
          :model-value="checkboxFalse"
          disabled
          indeterminate
          label="Checkbox 5"
          hint="Disabled and indeterminate"
        />
        <alex-inputs-checkbox
          :model-value="checkboxFalse"
          indeterminate
          readonly
          label="Checkbox 6"
          hint="Readonly and indeterminate"
        />
      </div>
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="firstExampleActivePage"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="firstExampleActivePage" class="w-100">
        <v-window-item value="1">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{ firstExampleTemplate }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(firstExampleTemplate, 'firstTemplate')"
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
      ${firstExampleScript}
      &lt;/script&gt;
                  `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(firstExampleScript, 'firstScript')"
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
    <h2 class="text-h3 text-gray-800">modelValue</h2>
    <p class="text-subtitle-2 text-gray-500">
      A propriedade <strong>modelValue</strong> é um booleano que, quando
      verdadeiro, deixa o checkbox marcado. Para que o checkbox esteja
      inicialmente sem marcação, basta informar
      <strong>:modelValue = "false"</strong>.
    </p>
    <h2 class="text-h3 text-gray-800">Variante: No Label, No Hint</h2>
    <p class="text-subtitle-2 text-gray-500">
      Caso deseje, você pode criar checkboxes sem label ou sem hint (ou ambos),
      para isso basta não adicionar as propriedades
      <strong>label</strong> ou <strong>hint</strong>.
    </p>
    <div class="w-100">
      <alex-inputs-checkbox v-model:model-value="checkboxExOne" />
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="secondExampleActivePage"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="secondExampleActivePage" class="w-100">
        <v-window-item value="1">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{ secondExampleTemplate }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(secondExampleTemplate, 'secondTemplate')"
            >
              <v-icon
                v-if="copiedValue == 'secondTemplate'"
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
      ${secondExampleScript}
      &lt;/script&gt;
                  `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(secondExampleScript, 'secondScript')"
            >
              <v-icon
                v-if="copiedValue == 'secondScript'"
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
    <h2 class="text-h3 text-gray-800">Uso do Disabled e Readonly</h2>
    <p class="text-subtitle-2 text-gray-500">
      O checkbox pode ser modificado com as props disabled ou readonly, o
      disabled é um booleano que, quando verdadeiro, desativa o checkbox e seu
      estilo, já o readonly é um booleano que, quando verdadeiro, torna o
      checkbox somente leitura, mas sem desativar o seu estilo <br />
      <Prism inline class="bg-white pa-0"
        >{{ `
        <alex-inputs-checkbox
          :model-value="checkboxFalse"
          disabled
          label="Disabled Checkbox"
          hint="You can't change its value"
        />` }}</Prism
      >
      <br />
      <Prism inline class="bg-white"
        >{{ `<alex-inputs-checkbox
          :model-value="checkboxTrue"
          readonly
          label="Readonly Checkbox"
          hint="You can still see it's style"
        />` }}</Prism
      >
    </p>

    <div class="w-100">
      <alex-inputs-checkbox
        :model-value="checkboxFalse"
        disabled
        label="Disabled Checkbox"
        hint="You can't change its value"
      />
      <alex-inputs-checkbox
        :model-value="checkboxTrue"
        readonly
        label="Readonly Checkbox"
        hint="You can still see it's style"
      />
    </div>
    <div class="w-100">
      <div
        class="d-flex align-center justify-space-between w-100 px-3 bg-gray-100 rounded-t"
      >
        <alex-custom-tabs
          v-model="thirdExampleActivePage"
          :tabs="exampleTabs"
          color="black"
        ></alex-custom-tabs>
        <v-icon icon=" mdi-code-tags" color="gray-600" />
      </div>
      <v-window v-model="thirdExampleActivePage" class="w-100">
        <v-window-item value="1">
          <div class="bg-grey-lighten-5 pa-3" style="position: relative">
            <prism class="bg-grey-lighten-5">
              {{ thirdExampleTemplate }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(thirdExampleTemplate, 'thirdTemplate')"
            >
              <v-icon
                v-if="copiedValue == 'thirdTemplate'"
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
      ${thirdExampleScript}
      &lt;/script&gt;
                  `
              }}
            </prism>
            <v-btn
              class="copy-icon"
              variant="text"
              color="gray-400"
              @click="copyToClipboard(thirdExampleScript, 'thirdScript')"
            >
              <v-icon
                v-if="copiedValue == 'thirdScript'"
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
  </v-container>
</template>

<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';

const checkboxOne = ref(false);
const checkboxTwo = ref(true);
const checkboxThree = ref(null);
const checkboxExOne = ref(false);
const checkboxFalse = ref(false);
const checkboxTrue = ref(true);
watch(
  () => checkboxThree.value,
  () => console.log(checkboxThree.value),
);
const copiedValue = ref('');
const firstExampleActivePage = ref('1');
const secondExampleActivePage = ref('1');
const thirdExampleActivePage = ref('1');

const propsExample = `
    <alex-inputs-checkbox 
    :model-value="checkboxExOne"
    label="Checkbox" 
    hint="Example 1" />
    `;

const firstExampleTemplate = `
  <alex-inputs-checkbox 
    :model-value="checkboxOne"
    label="Checkbox 1" 
    hint="Hint" 
  /> `;

const secondExampleTemplate = `
  <alex-inputs-checkbox :model-value="checkboxFalse" />
  <alex-inputs-checkbox :model-value="checkboxTrue"/>
  <alex-inputs-checkbox :model-value="checkboxThree" indeterminate />
  `;

const thirdExampleTemplate = `
  <template>
    <alex-inputs-checkbox 
    :model-value="checkboxFalse"
    label="Checkbox 1" 
    hint="False" 
    />

    <alex-inputs-checkbox 
    :model-value="checkboxTrue"
    label="Checkbox 2" 
    hint="True" 
    />
    
    <alex-inputs-checkbox
      :model-value="checkboxThree"
      indeterminate
      label="Checkbox 3"
      hint="Indeterminate"
    />
    
    <alex-inputs-checkbox
          :model-value="checkboxTrue"
          disabled
          label="Checkbox 4"
          hint="Disabled"
        />
        <alex-inputs-checkbox
          :model-value="checkboxFalse"
          disabled
          indeterminate
          label="Checkbox 5"
          hint="Disabled and indeterminate"
        />
        <alex-inputs-checkbox
          :model-value="checkboxFalse"
          indeterminate
          readonly
          label="Checkbox 6"
          hint="Readonly and indeterminate"
        />
      </div>
  </template>`;

const exampleTabs = [
  {
    label: 'Template',
    value: '1',
  },
];

const thirdExampleScript = `

const checkboxOne = ref(false);
const checkboxTwo = ref(true);
const checkboxThree = ref(null);
const checkboxFalse = ref(false);
const checkboxTrue = ref(true);
`;

const copyToClipboard = async (message, item) => {
  await navigator.clipboard.writeText(message);
  copiedValue.value = item;
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
</style>
