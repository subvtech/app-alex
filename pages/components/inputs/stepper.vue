<template>
  <v-container
    class="page rounded-lg bg-white pa-8 d-flex flex-column align-start pb-15"
  >
    <h1 class="text-h2 text-gray-800">Stepper</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-inputs-stepper</strong>
      é um componente utilizado para dividir em passos tarefas/informações que
      exigem muito do usuário.
    </p>
    <h2 class="text-h3 text-gray-800">Uso do Componente</h2>
    <div>
      <p class="text-subtitle-2 text-gray-500">
        O componente funciona a partir dos templates, é necessário colocar os
        templates com os nomes corretamente, começando a partir do step1, step2,
        stepN... Não é necessário colocar em ordem mas por questões de
        organização é recomendado. é possível adicionar classes nos indicadores
        com o stepperIndicatorClass no container dos steps stepclass
      </p>
    </div>
    <div class="w-100 d-flex align-center justify-center pa-4">
      <alex-inputs-stepper>
        <template #step1>Step 1</template>
        <template #step2>Step 2</template>
        <template #step3>Step 3</template>
        <template #step4>Step N</template>
      </alex-inputs-stepper>
    </div>
    <div class="w-100">
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
              <td>noHeader</td>
              <td>boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>noControls</td>
              <td>boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>loading</td>
              <td>boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>stepsConfig</td>
              <td>StepsConfig</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>stepClass</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>stepperIndicatorClass</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">
      Uso do Componente: Editando configurações de cada Passo
    </h2>
    <p class="text-subtitle-2 text-gray-500">
      A propriedade
      <strong class="bg-accent pa-1 rounded">stepsConfig</strong> servirá para
      alterar configurações de validação, título, subtítulo, icone, status de
      cada step. Basicamente cada nome utilizado nos templates do steps servirão
      para acessar as propriedades e alterar que deseja.
    </p>
    <div class="d-flex w-100 justify-space-evenly flex-column flex-sm-row">
      <div class="w-100">
        <p class="text-h5 text-center">Tipo: StepsConfig</p>
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
              <td>title</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>subtitle</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>icon</td>
              <td>string</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>scheme</td>
              <td>yup.Schema</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>completed</td>
              <td>boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>validate</td>
              <td>Validate[]</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <div class="w-100 d-flex align-center justify-center pa-4">
      <alex-inputs-stepper
        :steps-config="{
          step1: { title: 'Informações', subtitle: 'Gerais' },
          step2: {
            title: 'Mídia',
            subtitle: 'Descritiva',
            icon: 'mdi-image',
          },
        }"
      >
        <template #step1
          ><alex-inputs-text-field name="passo1" label="Passo 1"
        /></template>
        <template #step2
          ><alex-inputs-text-field name="passo2" label="Passo 2"
        /></template>
      </alex-inputs-stepper>
    </div>
    <div class="w-100">
      <div class="bg-grey-lighten-5 pa-3" style="position: relative">
        <prism class="bg-grey-lighten-5">
          {{ secondExampleTemplate }}
        </prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(secondExampleTemplate, 'secondExample')"
        >
          <v-icon
            v-if="copiedValue == 'secondExample'"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>
    <h2 class="text-h3 text-gray-800">
      Uso do Componente: Validando campos por passo
    </h2>
    <p class="text-subtitle-2 text-gray-500">
      Os passos do stepper são validados a partir dos "schemes" do yup, então é
      necessário fazer "schemes" para validar campos do stepper, entretanto é
      possível passar uma função asyncrona requisitando ou verificando alguma
      informação em cada passo. Basta apenas passar no stepsConfig um array dos
      campos e das funções para cada campo que será validado.
    </p>
    <div class="w-100">
      <p class="text-h5 text-center">Tipo: Validate</p>
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
            <td>name</td>
            <td>string</td>
            <td class="text-center">
              <v-icon icon="mdi-close-box" color="error" />
            </td>
          </tr>
          <tr>
            <td>callback</td>
            <td>
              {{
                '(value: string) => Promise< | { status: boolean; message: string; } | undefined | any >'
              }}
            </td>
            <td class="text-center">
              <v-icon icon="mdi-close-box" color="error" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <div class="w-100 d-flex align-center justify-center pa-4">
      <alex-inputs-stepper
        :steps-config="{
          step1: {
            title: 'Informações',
            subtitle: 'Gerais',
            validate: [
              {
                name: 'firstStep',
                callback: (value) => mockRequest('firstStep', false),
              },
            ],
            scheme: yup.object({ firstStep: yup.string().required() }),
          },
          step2: {
            title: 'Mídia',
            subtitle: 'Descritiva',
            icon: 'mdi-image',
          },
        }"
      >
        <template #step1
          ><alex-inputs-text-field name="firstStep" label="Passo 1 With error"
        /></template>
        <template #step2
          ><alex-inputs-text-field name="passo2" label="Passo 2"
        /></template>
      </alex-inputs-stepper>
    </div>
    <div class="w-100">
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
    </div>
    <h2 class="text-h3 text-gray-800">
      Uso do Componente: Customização do footer
    </h2>
    <p class="text-subtitle-2 text-gray-500">
      É possível através do slot #controls customizar o footer do modal tenho
      acesso as funções de cada botão. OBS: para avançar de passo é necessário
      utilizar um botão com o tipo 'submit'
    </p>
    <div class="w-100 d-flex align-center justify-center pa-4">
      <alex-inputs-stepper
        :steps-config="{
          step1: {
            title: 'Informações',
            subtitle: 'Gerais',
          },
          step2: {
            title: 'Mídia',
            subtitle: 'Descritiva',
            icon: 'mdi-image',
          },
        }"
      >
        <template
          #controls="{ isFirstStep, isLastStep, isValid, loading, onPrevStep }"
        >
          <div class="d-flex">
            <alex-custom-button
              text="Voltar"
              @click="onPrevStep"
              variant="secondary"
            />

            <div class="px-4">
              <p>
                Primeiro Step
                <strong class="bg-accent pa-1 rounded">{{
                  isFirstStep
                }}</strong>
              </p>
              <p>
                Último Step
                <strong class="bg-accent pa-1 rounded">{{ isLastStep }}</strong>
              </p>
              <p>
                Step válido
                <strong class="bg-accent pa-1 rounded">{{ isValid }}</strong>
              </p>
              <p>
                Carregando
                <strong class="bg-accent pa-1 rounded">{{ loading }}</strong>
              </p>
            </div>
            <alex-custom-button type="submit" text="Avançar" />
          </div>
        </template>
        <template #step1
          ><alex-inputs-text-field name="firstStep" label="Passo 1 With error"
        /></template>
        <template #step2
          ><alex-inputs-text-field name="passo2" label="Passo 2"
        /></template>
      </alex-inputs-stepper>
    </div>
    <div class="w-100">
      <div class="bg-grey-lighten-5 pa-3" style="position: relative">
        <prism class="bg-grey-lighten-5">
          {{ fourthExampleTemplate }}
        </prism>
        <v-btn
          class="copy-icon"
          variant="text"
          color="gray-400"
          @click="copyToClipboard(fourthExampleTemplate, 'fourthExample')"
        >
          <v-icon
            v-if="copiedValue == 'fourthExample'"
            size="x-large"
            icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1"
          />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import 'prismjs';
import 'prismjs/themes/prism.css';
import Prism from 'vue-prism-component';
import * as yup from 'yup';
definePageMeta({ layout: 'components' });
const firstExampleTemplate = ref(`<alex-inputs-stepper>
        <template #step1>Step 1</template>
        <template #step2>Step 2</template>
        <template #step3>Step 3</template>
        <template #step4>Step N</template>
</alex-inputs-stepper>
`);
const secondExampleTemplate = ref(`<alex-inputs-stepper
        :steps-config="{
          step1: { title: 'Informações', subtitle: 'Gerais' },
          step2: {
            title: 'Mídia',
            subtitle: 'Descritiva',
            icon: 'mdi-image',
          },
        }"
      >
        <template #step1>Step 1</template>
        <template #step2>Step 2</template>
</alex-inputs-stepper>
`);
const thirdExampleTemplate = ref(` <alex-inputs-stepper
        :steps-config="{
          step1: {
            title: 'Informações',
            subtitle: 'Gerais',
            validate: [
              {
                name: 'firstStep',
                callback: (value) => mock('firstStep', false),
              },
            ],
            scheme: yup.object({ firstStep: yup.string().required() }),
          },
          step2: {
            title: 'Mídia',
            subtitle: 'Descritiva',
            icon: 'mdi-image',
          },
        }"
      >
        <template #step1>
          <alex-inputs-text-field name="firstStep" label="Passo 1 With error" />
        </template>
        <template #step2>
          <alex-inputs-text-field name="passo2" label="Passo 2" />
        </template>
</alex-inputs-stepper>
`);
const fourthExampleTemplate = ref(` <alex-inputs-stepper
        :steps-config="{
          step1: {
            title: 'Informações',
            subtitle: 'Gerais',
          },
          step2: {
            title: 'Mídia',
            subtitle: 'Descritiva',
            icon: 'mdi-image',
          },
        }"
      >
        <template #controls="{ isFirstStep, isLastStep, isValid, loading, onPrevStep }" >
          <div class="d-flex">
            <alex-custom-button
              text="Voltar"
              @click="onPrevStep"
              variant="secondary"
            />

            <div class="px-4">
              <p> Primeiro Step
                <strong class="bg-accent pa-1 rounded">{{
                  isFirstStep
                }}</strong>
              </p>
              <p> Último Step
                <strong class="bg-accent pa-1 rounded">{{ isLastStep }}</strong>
              </p>
              <p> Step válido
                <strong class="bg-accent pa-1 rounded">{{ isValid }}</strong>
              </p>
              <p> Carregando
                <strong class="bg-accent pa-1 rounded">{{ loading }}</strong>
              </p>
            </div>
            <alex-custom-button type="submit" text="Avançar" />
          </div>
        </template>
        <template #step1>
          <alex-inputs-text-field name="firstStep" label="Passo 1 With error"/>
        </template>
        <template #step2>
          <alex-inputs-text-field name="passo2" label="Passo 2"/>
        </template>
</alex-inputs-stepper>
`);

const mockRequest = (name: string, success: boolean) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (success) {
        resolve({ status: true, message: `${name} success` });
      } else {
        resolve({ status: false, message: `${name} error` });
      }
    }, 100);
  });
};

const copiedValue = ref('');

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

.playground-select > * .v-select__selection {
  margin-left: 35px !important;
}
</style>
