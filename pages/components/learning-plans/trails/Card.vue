<template>
  <v-container class="page rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15">
    <h1 class="text-h2 text-gray-800">Card de Trilhas</h1>
    <p class="text-subtitle-2 text-gray-500">
      O
      <strong class="bg-accent pa-1 rounded">alex-learningplan-trails-card</strong>
      é um componente que tem como principal objetivo representar e organizar
      informações de forma compacta e acessível no contexto de trilhas.
    </p>
    <h2 class="text-h2 text-gray-800">Uso Básico</h2>
    <p class="text-subtitle-2 text-gray-500">
      Tem como propriedades obrigatórias o <strong>image</strong>,
      <strong>name</strong>, <strong>description</strong>,
    </p>
    <p class="text-subtitle-2 text-gray-500">
      Há duas formas de visualizações do <strong>Card de Trilhas</strong>. Se a
      tela for menor que 600px o card ficará na vertical ( redimensione a tela
      para poder visualizar), caso seja maior ela permanece na horizontal
    </p>

    <div class="w-100 flex-column d-flex gap-4">
      <div class="d-flex" style="gap: 8px">
        <alex-learningplan-trails-card
          name="Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer"
          description="Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem"
          :image="{
            url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
          }" />
      </div>
      <div class="a w-100" style="position: relative">
        <prism> {{ examples[0] }}</prism>
        <v-btn class="copy-icon" variant="text" color="gray-400" @click="copyToClipboard(0)">
          <v-icon v-if="copiedIndex === 0" size="x-large" icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1" />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <div class="d-flex w-100 justify-space-evenly flex-column">
      <div>
        <p class="text-h5 text-center">Props do componente</p>
        <v-table variant="outline" class="w-full">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th>Tipo</th>
              <th>Obrigatório</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>image</td>
              <td>{ url: string; alt?: string }</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>name</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>description</td>
              <td>String</td>
              <td class="text-center">
                <v-icon icon="mdi-checkbox-marked" color="success" />
              </td>
            </tr>
            <tr>
              <td>blocks</td>
              <td>{ type: string }</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>type</td>
              <td>'{{ LearningPlanType.PROJECT }}' | 'course'</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td>hide</td>
              <td>boolean</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>

    <div class="d-flex w-100 justify-space-evenly flex-column">
      <div>
        <p class="text-h5 text-center">Eventos do componente</p>
        <v-table variant="outline" class="w-full">
          <thead>
            <tr>
              <th>Nome da Evento</th>
              <th>Descrição</th>
              <th>Obrigatório</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong class="text-success-0">@open</strong></td>
              <td>Ação ao clicar no card</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td><strong class="text-success-0">@copy</strong></td>
              <td>Ação ao clicar em copiar</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>

            <tr>
              <td><strong class="text-success-0">@configurations</strong></td>
              <td>Ação ao clicar em configurações</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td><strong class="text-success-0">@show</strong></td>
              <td>Ação ao clicar em mostrar</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
            <tr>
              <td><strong class="text-success-0">@hide</strong></td>
              <td>Ação ao clicar em ocultar</td>
              <td class="text-center">
                <v-icon icon="mdi-close-box" color="error" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
    <h2 class="text-h2 text-gray-800">Variante: Oculto</h2>
    <p class="text-subtitle-2 text-gray-500">
      Modo de visualização do card sinalizando que o card não está visível para
      todos.
    </p>

    <div class="w-100 flex-column d-flex gap-4">
      <div class="d-flex" style="gap: 8px">
        <alex-learningplan-trails-card
          name="Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer"
          description="Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem"
          :image="{
            url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
          }" hide />
      </div>
      <div class="a w-100" style="position: relative">
        <prism> {{ examples[1] }}</prism>
        <v-btn class="copy-icon" variant="text" color="gray-400" @click="copyToClipboard(1)">
          <v-icon v-if="copiedIndex === 1" size="x-large" icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1" />
          <v-icon v-else size="x-large" icon="mdi-content-copy" />
        </v-btn>
      </div>
    </div>

    <h2 class="text-h2 text-gray-800">Variante: Blocos</h2>
    <p class="text-subtitle-2 text-gray-500">
      Poderá ser passado um array de blocos que representaram uma síntese dos
      tipos de conteúdo da trilha. Apenas dando um hover no ícone com número
      abaixo da descrição.
    </p>
    <v-table variant="outline" class="w-full">
      <thead>
        <tr>
          <th>Propriedade</th>
          <th>Tipo</th>
          <th>Obrigatório</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>type</td>
          <td>string</td>
          <td class="text-center">
            <v-icon icon="mdi-checkbox-marked" color="success" />
          </td>
        </tr>
      </tbody>
    </v-table>
    <div class="w-100 flex-column d-flex gap-4">
      <div class="d-flex flex-column" style="gap: 8px">
        <alex-learningplan-trails-card
          name="Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer"
          description="Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem"
          :image="{
            url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
          }" :blocks="[
            { type: 'video' },
            { type: 'article' },
            { type: 'article' },
            { type: 'video' },
          ]" />
      </div>
      <div class="a w-100" style="position: relative">
        <prism> {{ examples[3] }}</prism>
        <v-btn class="copy-icon" variant="text" color="gray-400" @click="copyToClipboard(3)">
          <v-icon v-if="copiedIndex === 3" size="x-large" icon="mdi-clipboard-check-multiple-outline"
            color="green-lighten-1" />
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

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const copiedValue = ref('');
const copiedIndex = ref(-1);
const examples = [
  `<alex-learningplan-trails-card
          name="Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer"
          description="Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem"
          :image="{
            url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
          }"
        />`,
  ` <alex-learningplan-trails-card
          name="Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer"
          description="Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem"
          :image="{
            url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
          }"
          hide
        />`,
  `<alex-learningplan-trails-card
          name="sistemas operacionais"
          description="Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem"
          :image="{
            url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
          }"
          hide
        />
        `,
  `<alex-learningplan-trails-card
          name="Gerenciamento de sistemas operacionais e projeto de redes utilizando o packet tracer"
          description="Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem"
          :image="{
            url: 'https://segwitz.com/wp-content/uploads/2021/06/vuejs-development-malaysia.jpeg',
          }"
          :blocks="[{ type: 'article'}]"
        />`,
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
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;

  /* Firefox */
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
